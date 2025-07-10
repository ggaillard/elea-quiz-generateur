import * as pdfParse from 'pdf-parse';
import { readFile } from 'fs/promises';
import path from 'path';
import { 
  PDFAnalysisResult, 
  PDFChunk, 
  PDFMetadata, 
  ProcessingOptions,
  ContentSection,
  KeyConcept,
  TextComplexity 
} from '../types/index.js';

/**
 * Service avancé pour l'analyse et le traitement de fichiers PDF
 * Optimisé pour l'extraction de contenu éducatif et la préparation à la génération de QCM
 */
export class PDFService {
  private readonly maxChunkSize: number = 3000;
  private readonly overlapSize: number = 200;
  private readonly minConceptLength: number = 10;

  /**
   * Analyse complète d'un fichier PDF
   * @param filePath Chemin vers le fichier PDF
   * @param options Options de traitement
   * @returns Résultat d'analyse structuré
   */
  async analyzePDF(filePath: string, options: ProcessingOptions = {}): Promise<PDFAnalysisResult> {
    try {
      console.log(`📄 Début de l'analyse PDF: ${path.basename(filePath)}`);
      
      // Lecture et parsing du PDF
      const buffer = await readFile(filePath);
      const pdfData = await pdfParse(buffer);
      
      // Extraction des métadonnées
      const metadata = this.extractMetadata(pdfData, filePath);
      
      // Nettoyage et normalisation du texte
      const cleanText = this.cleanText(pdfData.text);
      
      // Détection de la structure du document
      const sections = this.detectSections(cleanText);
      
      // Chunking intelligent du contenu
      const chunks = this.createIntelligentChunks(cleanText, sections, options);
      
      // Extraction des concepts clés
      const keyConcepts = this.extractKeyConcepts(cleanText, sections);
      
      // Analyse de la complexité
      const complexity = this.analyzeComplexity(cleanText);
      
      // Suggestions pour la génération de QCM
      const suggestions = this.generateQuizSuggestions(sections, keyConcepts, complexity);
      
      const result: PDFAnalysisResult = {
        metadata,
        sections,
        chunks,
        keyConcepts,
        complexity,
        suggestions,
        rawText: cleanText,
        processingStats: {
          totalPages: pdfData.numpages,
          totalWords: cleanText.split(/\s+/).length,
          processingTime: Date.now(),
          chunkCount: chunks.length,
          conceptCount: keyConcepts.length
        }
      };
      
      console.log(`✅ Analyse terminée: ${chunks.length} chunks, ${keyConcepts.length} concepts identifiés`);
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'analyse PDF:`, error);
      throw new Error(`Échec de l'analyse PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Extraction des métadonnées du PDF
   */
  private extractMetadata(pdfData: any, filePath: string): PDFMetadata {
    const info = pdfData.info || {};
    const fileName = path.basename(filePath);
    
    return {
      title: info.Title || fileName.replace('.pdf', ''),
      author: info.Author || 'Non spécifié',
      subject: info.Subject || '',
      keywords: info.Keywords ? info.Keywords.split(',').map((k: string) => k.trim()) : [],
      creator: info.Creator || '',
      producer: info.Producer || '',
      creationDate: info.CreationDate || new Date().toISOString(),
      pages: pdfData.numpages || 0,
      fileSize: 0, // À calculer si nécessaire
      language: this.detectLanguage(pdfData.text)
    };
  }

  /**
   * Nettoyage et normalisation du texte
   */
  private cleanText(rawText: string): string {
    return rawText
      // Normalisation des espaces
      .replace(/\s+/g, ' ')
      // Suppression des caractères de contrôle
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Correction des tirets
      .replace(/[\u2010-\u2015]/g, '-')
      // Correction des guillemets
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      // Suppression des espaces en début/fin
      .trim();
  }

  /**
   * Détection intelligente des sections du document
   */
  private detectSections(text: string): ContentSection[] {
    const sections: ContentSection[] = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    let currentSection: ContentSection | null = null;
    let sectionIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Détection des titres (heuristiques)
      if (this.isTitle(line, i, lines)) {
        // Finaliser la section précédente
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Créer une nouvelle section
        currentSection = {
          id: `section-${sectionIndex++}`,
          title: line,
          content: '',
          startIndex: i,
          endIndex: i,
          level: this.detectTitleLevel(line),
          type: this.detectSectionType(line),
          concepts: []
        };
      } else if (currentSection) {
        // Ajouter le contenu à la section courante
        currentSection.content += line + '\n';
        currentSection.endIndex = i;
      } else {
        // Créer une section par défaut si aucune n'est détectée
        if (sections.length === 0) {
          currentSection = {
            id: 'section-0',
            title: 'Introduction',
            content: line + '\n',
            startIndex: 0,
            endIndex: i,
            level: 1,
            type: 'introduction',
            concepts: []
          };
        }
      }
    }
    
    // Finaliser la dernière section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }

  /**
   * Détection si une ligne est un titre
   */
  private isTitle(line: string, index: number, lines: string[]): boolean {
    // Heuristiques pour détecter les titres
    const titleIndicators = [
      // Numérotation
      /^\d+\.\s+/,
      /^\d+\.\d+\s+/,
      /^[A-Z]+\.\s+/,
      // Chapitres
      /^(chapitre|chapter|section|partie|part)\s+\d+/i,
      // Mots clés éducatifs
      /^(objectifs?|introduction|conclusion|résumé|summary|exercices?)/i,
      // Ligne courte en majuscules
      /^[A-Z\s]{3,50}$/
    ];
    
    return titleIndicators.some(pattern => pattern.test(line)) ||
           (line.length < 100 && line.length > 3 && 
            line === line.toUpperCase() && 
            /^[A-Z\s\d\-\.\,\:\;]+$/.test(line));
  }

  /**
   * Détection du niveau hiérarchique d'un titre
   */
  private detectTitleLevel(title: string): number {
    if (/^\d+\.\d+\.\d+/.test(title)) return 3;
    if (/^\d+\.\d+/.test(title)) return 2;
    if (/^\d+\./.test(title)) return 1;
    if (/^[A-Z\s]+$/.test(title)) return 1;
    return 2;
  }

  /**
   * Détection du type de section
   */
  private detectSectionType(title: string): string {
    const types = {
      'introduction': /^(introduction|préface|avant.propos)/i,
      'objectives': /^(objectifs?|goals?|aims?)/i,
      'theory': /^(théorie|theory|concepts?|définitions?)/i,
      'examples': /^(exemples?|examples?|cas.d.étude)/i,
      'exercises': /^(exercices?|exercises?|problèmes?)/i,
      'conclusion': /^(conclusion|résumé|summary|synthèse)/i,
      'references': /^(références?|bibliographie|sources?)/i
    };
    
    for (const [type, pattern] of Object.entries(types)) {
      if (pattern.test(title)) {
        return type;
      }
    }
    
    return 'content';
  }

  /**
   * Création de chunks intelligents basés sur le contexte
   */
  private createIntelligentChunks(text: string, sections: ContentSection[], options: ProcessingOptions): PDFChunk[] {
    const chunks: PDFChunk[] = [];
    const maxSize = options.chunkSize || this.maxChunkSize;
    const overlap = options.overlapSize || this.overlapSize;
    
    for (const section of sections) {
      if (section.content.length <= maxSize) {
        // Section complète dans un chunk
        chunks.push({
          id: `chunk-${chunks.length}`,
          content: section.content,
          startIndex: section.startIndex,
          endIndex: section.endIndex,
          sectionId: section.id,
          concepts: [],
          importance: this.calculateImportance(section.content),
          readabilityScore: this.calculateReadability(section.content)
        });
      } else {
        // Diviser la section en chunks avec overlap
        const sectionChunks = this.splitWithOverlap(section.content, maxSize, overlap);
        
        sectionChunks.forEach((chunkContent, index) => {
          chunks.push({
            id: `chunk-${chunks.length}`,
            content: chunkContent,
            startIndex: section.startIndex + index * (maxSize - overlap),
            endIndex: section.startIndex + index * (maxSize - overlap) + chunkContent.length,
            sectionId: section.id,
            concepts: [],
            importance: this.calculateImportance(chunkContent),
            readabilityScore: this.calculateReadability(chunkContent)
          });
        });
      }
    }
    
    return chunks;
  }

  /**
   * Division du texte avec overlap
   */
  private splitWithOverlap(text: string, maxSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < text.length) {
      let end = start + maxSize;
      
      // Ajuster pour éviter de couper au milieu d'un mot
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(' ', end);
        if (lastSpace > start) {
          end = lastSpace;
        }
      }
      
      chunks.push(text.substring(start, end));
      start = end - overlap;
    }
    
    return chunks;
  }

  /**
   * Extraction des concepts clés
   */
  private extractKeyConcepts(text: string, sections: ContentSection[]): KeyConcept[] {
    const concepts: KeyConcept[] = [];
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = new Map<string, number>();
    
    // Comptage des fréquences
    words.forEach(word => {
      if (word.length >= this.minConceptLength) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    // Extraction des concepts importants
    const importantWords = Array.from(wordFreq.entries())
      .filter(([word, freq]) => freq >= 3 && this.isImportantWord(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
    
    importantWords.forEach(([term, frequency], index) => {
      concepts.push({
        term,
        frequency,
        importance: this.calculateConceptImportance(term, frequency, text),
        context: this.extractContext(term, text),
        relatedTerms: this.findRelatedTerms(term, importantWords.map(w => w[0])),
        sections: sections.filter(s => s.content.toLowerCase().includes(term)).map(s => s.id)
      });
    });
    
    return concepts;
  }

  /**
   * Vérification si un mot est important
   */
  private isImportantWord(word: string): boolean {
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais',
      'pour', 'avec', 'sans', 'dans', 'sur', 'sous', 'par', 'ce', 'cette',
      'ces', 'qui', 'que', 'dont', 'où', 'il', 'elle', 'ils', 'elles',
      'nous', 'vous', 'je', 'tu', 'me', 'te', 'se', 'lui', 'leur',
      'est', 'sont', 'être', 'avoir', 'faire', 'dit', 'peut', 'très',
      'plus', 'moins', 'bien', 'mal', 'tout', 'tous', 'toute', 'toutes'
    ]);
    
    return !stopWords.has(word) && 
           word.length >= 3 && 
           /^[a-zàâäéèêëïîôöùûüÿç]+$/.test(word);
  }

  /**
   * Calcul de l'importance d'un concept
   */
  private calculateConceptImportance(term: string, frequency: number, text: string): number {
    let importance = frequency * 0.5;
    
    // Bonus pour les termes techniques
    if (/^[A-Z]/.test(term)) importance += 0.3;
    if (term.length > 8) importance += 0.2;
    
    // Bonus pour les termes en position importante
    const sentences = text.split(/[.!?]+/);
    const titlePositions = sentences.filter(s => s.toLowerCase().includes(term) && s.length < 100).length;
    importance += titlePositions * 0.1;
    
    return Math.min(importance, 1.0);
  }

  /**
   * Extraction du contexte d'un terme
   */
  private extractContext(term: string, text: string): string {
    const regex = new RegExp(`(.{0,100}\\b${term}\\b.{0,100})`, 'gi');
    const matches = text.match(regex);
    return matches ? matches[0].trim() : '';
  }

  /**
   * Recherche de termes liés
   */
  private findRelatedTerms(term: string, allTerms: string[]): string[] {
    return allTerms.filter(t => 
      t !== term && 
      (t.includes(term) || term.includes(t) || this.haveSimilarRoot(term, t))
    ).slice(0, 5);
  }

  /**
   * Vérification de racine similaire
   */
  private haveSimilarRoot(term1: string, term2: string): boolean {
    const root1 = term1.substring(0, Math.min(term1.length, 6));
    const root2 = term2.substring(0, Math.min(term2.length, 6));
    return root1.length >= 4 && root1 === root2;
  }

  /**
   * Analyse de la complexité du texte
   */
  private analyzeComplexity(text: string): TextComplexity {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Calcul du score de lisibilité (simplifié)
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgCharsPerWord);
    
    // Détection de la complexité technique
    const technicalTerms = words.filter(w => w.length > 10 || /^[A-Z]{2,}/.test(w)).length;
    const technicalRatio = technicalTerms / words.length;
    
    let level: 'elementary' | 'intermediate' | 'advanced' | 'expert' = 'intermediate';
    
    if (readabilityScore > 80 && technicalRatio < 0.05) level = 'elementary';
    else if (readabilityScore > 60 && technicalRatio < 0.1) level = 'intermediate';
    else if (readabilityScore > 40 && technicalRatio < 0.2) level = 'advanced';
    else level = 'expert';
    
    return {
      readabilityScore,
      avgWordsPerSentence,
      avgCharsPerWord,
      technicalTermRatio: technicalRatio,
      level,
      estimatedReadingTime: Math.ceil(words.length / 200) // mots par minute
    };
  }

  /**
   * Calcul de l'importance d'un contenu
   */
  private calculateImportance(content: string): number {
    let importance = 0.5;
    
    // Facteurs augmentant l'importance
    if (content.includes('important') || content.includes('essentiel')) importance += 0.2;
    if (content.includes('définition') || content.includes('concept')) importance += 0.2;
    if (content.includes('exemple') || content.includes('cas')) importance += 0.1;
    if (content.includes('?')) importance += 0.1; // Questions
    
    // Facteurs diminuant l'importance
    if (content.includes('note') || content.includes('remarque')) importance -= 0.1;
    if (content.length < 100) importance -= 0.1;
    
    return Math.max(0.1, Math.min(1.0, importance));
  }

  /**
   * Calcul de la lisibilité
   */
  private calculateReadability(content: string): number {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence < 15) return 0.8;
    if (avgWordsPerSentence < 20) return 0.6;
    if (avgWordsPerSentence < 25) return 0.4;
    return 0.2;
  }

  /**
   * Génération de suggestions pour les QCM
   */
  private generateQuizSuggestions(sections: ContentSection[], concepts: KeyConcept[], complexity: TextComplexity): any {
    const suggestions = {
      recommendedQuestionCount: this.calculateRecommendedQuestions(sections, concepts),
      difficulty: this.mapComplexityToDifficulty(complexity.level),
      questionTypes: this.suggestQuestionTypes(sections, concepts),
      focusAreas: concepts.slice(0, 10).map(c => c.term),
      timeEstimate: Math.ceil(concepts.length * 0.5) // minutes par question
    };
    
    return suggestions;
  }

  /**
   * Calcul du nombre de questions recommandées
   */
  private calculateRecommendedQuestions(sections: ContentSection[], concepts: KeyConcept[]): number {
    const basedOnSections = sections.length * 2;
    const basedOnConcepts = Math.ceil(concepts.length * 0.3);
    return Math.max(5, Math.min(20, Math.max(basedOnSections, basedOnConcepts)));
  }

  /**
   * Mapping de la complexité vers la difficulté
   */
  private mapComplexityToDifficulty(level: string): string {
    const mapping = {
      'elementary': 'facile',
      'intermediate': 'moyen',
      'advanced': 'difficile',
      'expert': 'expert'
    };
    return mapping[level as keyof typeof mapping] || 'moyen';
  }

  /**
   * Suggestion des types de questions
   */
  private suggestQuestionTypes(sections: ContentSection[], concepts: KeyConcept[]): string[] {
    const types = ['multiple_choice'];
    
    if (concepts.length > 10) types.push('true_false');
    if (sections.some(s => s.type === 'examples')) types.push('case_study');
    if (sections.some(s => s.type === 'theory')) types.push('definition');
    
    return types;
  }

  /**
   * Détection basique de la langue
   */
  private detectLanguage(text: string): string {
    const frenchWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais', 'pour', 'avec'];
    const englishWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'to', 'in'];
    
    const words = text.toLowerCase().split(/\s+/).slice(0, 100);
    const frenchCount = words.filter(w => frenchWords.includes(w)).length;
    const englishCount = words.filter(w => englishWords.includes(w)).length;
    
    return frenchCount > englishCount ? 'fr' : 'en';
  }

  /**
   * Validation d'un fichier PDF
   */
  async validatePDF(filePath: string): Promise<boolean> {
    try {
      const buffer = await readFile(filePath);
      const pdfData = await pdfParse(buffer);
      return pdfData.text.length > 100; // Minimum de contenu
    } catch (error) {
      return false;
    }
  }

  /**
   * Extraction rapide du texte (sans analyse complète)
   */
  async extractText(filePath: string): Promise<string> {
    try {
      const buffer = await readFile(filePath);
      const pdfData = await pdfParse(buffer);
      return this.cleanText(pdfData.text);
    } catch (error) {
      throw new Error(`Impossible d'extraire le texte du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

// Export d'une instance par défaut
export const pdfService = new PDFService();
