import { OpenAI } from 'openai';
import { DefaultAzureCredential } from '@azure/identity';
import { OpenAIClient } from '@azure/openai';
import MistralClient from '@mistralai/mistralai';
import { AIConfig, QuizGenerationConfig, PDFAnalysisResult, GeneratedQuestion, Quiz, PromptTemplate, QualityMetrics } from '../types';

export class AIQuizService {
  private openaiClient: OpenAI | null = null;
  private azureClient: OpenAIClient | null = null;
  private mistralClient: MistralClient | null = null;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    try {
      if (this.config.provider === 'openai') {
        this.openaiClient = new OpenAI({
          apiKey: this.config.apiKey,
        });
      } else if (this.config.provider === 'azure-openai') {
        // Utilisation d'Azure Managed Identity (Best Practice)
        const credential = new DefaultAzureCredential();
        this.azureClient = new OpenAIClient(
          this.config.endpoint || '',
          credential
        );
      } else if (this.config.provider === 'mistral') {
        // Initialisation du client Mistral avec gestion d'erreurs
        if (!this.config.apiKey) {
          throw new Error('Clé API Mistral manquante');
        }
        
        this.mistralClient = new MistralClient(this.config.apiKey);
        
        // Vérification des paramètres spécifiques à Mistral
        if (!this.config.model) {
          console.warn('Modèle Mistral non spécifié, utilisation par défaut de mistral-large-latest');
          this.config.model = 'mistral-large-latest';
        }
      }
    } catch (error) {
      console.error(`Erreur d'initialisation du client ${this.config.provider}:`, error);
      throw error;
    }
  }

  /**
   * Génère un quiz complet à partir d'un document analysé
   */
  async generateQuiz(
    analysisResult: PDFAnalysisResult,
    config: QuizGenerationConfig
  ): Promise<Quiz> {
    const startTime = Date.now();
    
    try {
      // Sélectionner les chunks les plus pertinents
      const relevantChunks = this.selectRelevantChunks(analysisResult, config);
      
      // Générer les questions
      const questions = await this.generateQuestions(relevantChunks, config);
      
      // Évaluer et filtrer les questions
      const qualityQuestions = await this.evaluateQuestions(questions);
      
      // Sélectionner les meilleures questions
      const selectedQuestions = this.selectBestQuestions(qualityQuestions, config.count);
      
      // Créer le quiz
      const quiz: Quiz = {
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: this.generateQuizTitle(analysisResult, config),
        description: this.generateQuizDescription(analysisResult, config),
        sourceDocument: analysisResult.filename,
        generationConfig: config,
        questions: selectedQuestions,
        metadata: {
          totalQuestions: selectedQuestions.length,
          questionTypes: this.calculateQuestionTypes(selectedQuestions),
          difficultyDistribution: this.calculateDifficultyDistribution(selectedQuestions),
          estimatedDuration: this.calculateEstimatedDuration(selectedQuestions),
          totalPoints: selectedQuestions.reduce((sum, q) => sum + (q.metadata.suggestedPoints || 1), 0),
          concepts: [...new Set(selectedQuestions.flatMap(q => q.concept))],
          learningObjectives: this.generateLearningObjectives(selectedQuestions),
          prerequisites: this.generatePrerequisites(analysisResult, selectedQuestions)
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Log de performance
      console.log(`Quiz généré en ${Date.now() - startTime}ms`);
      
      return quiz;
      
    } catch (error) {
      console.error('Erreur génération quiz:', error);
      throw new Error(`Échec de la génération du quiz: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Sélectionne les chunks les plus pertinents pour la génération
   */
  private selectRelevantChunks(analysisResult: PDFAnalysisResult, config: QuizGenerationConfig): PDFAnalysisResult['chunks'] {
    return analysisResult.chunks
      .filter(chunk => chunk.semanticScore > 0.3) // Filtrer les chunks de faible qualité
      .sort((a, b) => b.semanticScore - a.semanticScore) // Trier par pertinence
      .slice(0, Math.min(config.count * 3, 100)); // Limiter pour éviter trop de tokens
  }

  /**
   * Génère les questions à partir des chunks
   */
  private async generateQuestions(
    chunks: PDFAnalysisResult['chunks'],
    config: QuizGenerationConfig
  ): Promise<GeneratedQuestion[]> {
    const questions: GeneratedQuestion[] = [];
    const questionsPerType = this.calculateQuestionsPerType(config);
    
    for (const [questionType, count] of Object.entries(questionsPerType)) {
      const typeQuestions = await this.generateQuestionsByType(
        chunks,
        questionType as any,
        count,
        config
      );
      questions.push(...typeQuestions);
    }
    
    return questions;
  }

  /**
   * Calcule la répartition des questions par type
   */
  private calculateQuestionsPerType(config: QuizGenerationConfig): Record<string, number> {
    if (config.type === 'mixed') {
      return {
        'mcq': Math.ceil(config.count * 0.5),
        'true-false': Math.ceil(config.count * 0.3),
        'short-answer': Math.ceil(config.count * 0.2)
      };
    }
    
    return { [config.type]: config.count };
  }

  /**
   * Génère des questions d'un type spécifique
   */
  private async generateQuestionsByType(
    chunks: PDFAnalysisResult['chunks'],
    questionType: string,
    count: number,
    config: QuizGenerationConfig
  ): Promise<GeneratedQuestion[]> {
    const questions: GeneratedQuestion[] = [];
    const shuffledChunks = this.shuffleArray([...chunks]);
    
    for (let i = 0; i < Math.min(count, shuffledChunks.length); i++) {
      try {
        const question = await this.generateSingleQuestion(
          shuffledChunks[i],
          questionType,
          config
        );
        
        if (question) {
          questions.push(question);
        }
      } catch (error) {
        console.error(`Erreur génération question ${questionType}:`, error);
        // Continuer avec les autres questions
      }
    }
    
    return questions;
  }

  /**
   * Génère une question individuelle
   */
  private async generateSingleQuestion(
    chunk: PDFAnalysisResult['chunks'][0],
    questionType: string,
    config: QuizGenerationConfig
  ): Promise<GeneratedQuestion | null> {
    const prompt = this.buildPrompt(chunk, questionType, config);
    
    try {
      let response;
      
      if (this.config.provider === 'openai' && this.openaiClient) {
        response = await this.openaiClient.chat.completions.create({
          model: this.config.model,
          messages: [
            { role: 'system', content: this.getSystemPrompt(config) },
            { role: 'user', content: prompt }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          top_p: this.config.topP,
          response_format: { type: 'json_object' }
        });
      } else if (this.config.provider === 'azure-openai' && this.azureClient) {
        response = await this.azureClient.getChatCompletions(
          this.config.model,
          [
            { role: 'system', content: this.getSystemPrompt(config) },
            { role: 'user', content: prompt }
          ],
          {
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
            topP: this.config.topP,
            responseFormat: { type: 'json_object' }
          }
        );
      } else if (this.config.provider === 'mistral' && this.mistralClient) {
        // Appel à l'API Mistral
        const mistralResponse = await this.mistralClient.chat({
          model: this.config.model,
          messages: [
            { role: 'system', content: this.getSystemPrompt(config) },
            { role: 'user', content: prompt }
          ],
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          topP: this.config.topP,
          safePrompt: this.config.safePrompt ?? true
        });
        
        // Adapter la réponse Mistral au format attendu
        response = {
          choices: [{
            message: {
              content: mistralResponse.choices[0]?.message?.content || ''
            }
          }]
        };
      }
      
      if (!response) {
        throw new Error('Aucune réponse de l\'IA');
      }
      
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Contenu de réponse vide');
      }
      
      const parsedResponse = JSON.parse(content);
      return this.createQuestionFromResponse(parsedResponse, chunk, questionType, config);
      
    } catch (error) {
      console.error('Erreur génération question:', error);
      return null;
    }
  }

  /**
   * Construit le prompt pour l'IA
   */
  private buildPrompt(
    chunk: PDFAnalysisResult['chunks'][0],
    questionType: string,
    config: QuizGenerationConfig
  ): string {
    const baseContext = `
TEXTE SOURCE:
${chunk.content}

CONTEXTE:
- Page: ${chunk.pageNumber}
- Concepts: ${chunk.concepts.join(', ')}
- Mots-clés: ${chunk.keywords.join(', ')}
- Niveau: ${config.level}
- Domaine: ${config.domain || 'général'}
- Style: ${config.style}
`;

    const promptTemplates = {
      mcq: `${baseContext}
Créez une question à choix multiples (QCM) basée sur ce texte.

EXIGENCES:
- Question claire et précise
- 4 options de réponse (A, B, C, D)
- Une seule bonne réponse
- 3 distracteurs plausibles mais incorrects
- Explication détaillée de la réponse

Répondez en JSON avec ce format exact:
{
  "question": "Votre question ici",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Explication détaillée",
  "difficulty": "easy|medium|hard",
  "concept": "concept principal",
  "bloomLevel": "remember|understand|apply|analyze|evaluate|create"
}`,

      'true-false': `${baseContext}
Créez une question Vrai/Faux basée sur ce texte.

EXIGENCES:
- Affirmation claire à évaluer
- Réponse correcte (true/false)
- Explication détaillée pour les deux cas

Répondez en JSON avec ce format exact:
{
  "question": "Votre affirmation ici",
  "correct": true,
  "explanation": "Explication détaillée",
  "difficulty": "easy|medium|hard",
  "concept": "concept principal",
  "bloomLevel": "remember|understand|apply|analyze|evaluate|create"
}`,

      'short-answer': `${baseContext}
Créez une question à réponse courte basée sur ce texte.

EXIGENCES:
- Question ouverte claire
- Réponse attendue (1-5 mots)
- Variantes acceptées
- Explication

Répondez en JSON avec ce format exact:
{
  "question": "Votre question ici",
  "correct": "réponse principale",
  "alternatives": ["variante1", "variante2"],
  "explanation": "Explication détaillée",
  "difficulty": "easy|medium|hard",
  "concept": "concept principal",
  "bloomLevel": "remember|understand|apply|analyze|evaluate|create"
}`,

      'matching': `${baseContext}
Créez une question d'appariement basée sur ce texte.

EXIGENCES:
- Consigne claire
- 4-6 paires d'éléments à associer
- Éléments distincts et non ambigus

Répondez en JSON avec ce format exact:
{
  "question": "Associez chaque élément...",
  "pairs": [
    {"left": "Élément 1", "right": "Association 1"},
    {"left": "Élément 2", "right": "Association 2"}
  ],
  "explanation": "Explication détaillée",
  "difficulty": "easy|medium|hard",
  "concept": "concept principal",
  "bloomLevel": "remember|understand|apply|analyze|evaluate|create"
}`
    };

    return promptTemplates[questionType as keyof typeof promptTemplates] || promptTemplates.mcq;
  }

  /**
   * Récupère le prompt système selon la configuration
   */
  private getSystemPrompt(config: QuizGenerationConfig): string {
    const languageInstructions = config.language === 'fr' 
      ? 'Répondez en français.' 
      : config.language === 'en' 
        ? 'Respond in English.' 
        : 'Détectez la langue du texte et répondez dans cette langue.';

    return `Vous êtes un expert en pédagogie et création de quiz éducatifs.
Votre rôle est de créer des questions de qualité professionnelle pour l'évaluation des apprentissages.

DIRECTIVES:
- Créez des questions pertinentes et pédagogiquement valides
- Adaptez la difficulté au niveau spécifié
- Utilisez un langage clair et précis
- Évitez les ambiguïtés et les pièges
- Incluez des explications constructives
- Respectez les standards éducatifs
- ${languageInstructions}

QUALITÉ REQUISE:
- Questions basées sur le contenu fourni
- Distracteurs plausibles mais incorrects
- Explications pédagogiques appropriées
- Niveau de difficulté cohérent
- Concepts clairement identifiés

Répondez UNIQUEMENT en JSON valide selon le format demandé.`;
  }

  /**
   * Crée une question à partir de la réponse IA
   */
  private createQuestionFromResponse(
    response: any,
    chunk: PDFAnalysisResult['chunks'][0],
    questionType: string,
    config: QuizGenerationConfig
  ): GeneratedQuestion {
    const baseQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: questionType as any,
      question: response.question,
      explanation: response.explanation,
      difficulty: response.difficulty || 'medium',
      concept: response.concept || chunk.concepts[0] || 'général',
      sourceChunk: chunk.id,
      pageReference: chunk.pageNumber,
      qualityScore: 0.8, // Sera calculé plus tard
      tags: [response.concept, ...chunk.keywords.slice(0, 3)],
      metadata: {
        bloomLevel: response.bloomLevel || 'understand',
        cognitiveLoad: this.calculateCognitiveLoad(response, questionType),
        estimatedTime: this.calculateEstimatedTime(response, questionType),
        relatedConcepts: chunk.concepts,
        suggestedPoints: this.calculateSuggestedPoints(response.difficulty),
        feedbackType: config.includeExplanations ? 'immediate' as const : 'delayed' as const
      }
    };

    // Adapter selon le type de question
    switch (questionType) {
      case 'mcq':
        return {
          ...baseQuestion,
          options: response.options,
          correct: response.correct
        };
      case 'true-false':
        return {
          ...baseQuestion,
          correct: response.correct
        };
      case 'short-answer':
        return {
          ...baseQuestion,
          correct: response.correct,
          options: response.alternatives
        };
      case 'matching':
        return {
          ...baseQuestion,
          correct: response.pairs,
          options: response.pairs.map((p: any) => p.left)
        };
      default:
        return {
          ...baseQuestion,
          correct: response.correct || ''
        };
    }
  }

  /**
   * Évalue la qualité des questions générées
   */
  private async evaluateQuestions(questions: GeneratedQuestion[]): Promise<GeneratedQuestion[]> {
    const evaluatedQuestions: GeneratedQuestion[] = [];
    
    for (const question of questions) {
      const metrics = await this.evaluateQuestionQuality(question);
      question.qualityScore = metrics.overallScore;
      evaluatedQuestions.push(question);
    }
    
    return evaluatedQuestions;
  }

  /**
   * Évalue la qualité d'une question individuelle
   */
  private async evaluateQuestionQuality(question: GeneratedQuestion): Promise<QualityMetrics> {
    // Évaluation basée sur des critères objectifs
    const clarity = this.evaluateClarity(question);
    const difficulty = this.evaluateDifficulty(question);
    const relevance = this.evaluateRelevance(question);
    const uniqueness = this.evaluateUniqueness(question);
    
    const overallScore = (clarity + difficulty + relevance + uniqueness) / 4;
    
    return {
      clarity,
      difficulty,
      relevance,
      uniqueness,
      overallScore,
      issues: this.identifyIssues(question),
      suggestions: this.generateSuggestions(question)
    };
  }

  /**
   * Sélectionne les meilleures questions
   */
  private selectBestQuestions(
    questions: GeneratedQuestion[],
    count: number
  ): GeneratedQuestion[] {
    return questions
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, count);
  }

  /**
   * Génère le titre du quiz
   */
  private generateQuizTitle(
    analysisResult: PDFAnalysisResult,
    config: QuizGenerationConfig
  ): string {
    const baseTitle = analysisResult.metadata.title || 
                     analysisResult.filename.replace(/\.[^/.]+$/, '');
    
    return `Quiz - ${baseTitle}`;
  }

  /**
   * Génère la description du quiz
   */
  private generateQuizDescription(
    analysisResult: PDFAnalysisResult,
    config: QuizGenerationConfig
  ): string {
    const conceptsList = analysisResult.concepts.slice(0, 5).join(', ');
    
    return `Quiz automatiquement généré à partir du document "${analysisResult.filename}".
Niveau: ${config.level}
Concepts principaux: ${conceptsList}
Type de questions: ${config.type}
Généré le: ${new Date().toLocaleDateString('fr-FR')}`;
  }

  // Méthodes utilitaires
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private calculateQuestionTypes(questions: GeneratedQuestion[]): Record<string, number> {
    const counts: Record<string, number> = {};
    questions.forEach(q => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return counts;
  }

  private calculateDifficultyDistribution(questions: GeneratedQuestion[]): Record<string, number> {
    const counts: Record<string, number> = {};
    questions.forEach(q => {
      counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
    });
    return counts;
  }

  private calculateEstimatedDuration(questions: GeneratedQuestion[]): number {
    return questions.reduce((sum, q) => sum + (q.metadata.estimatedTime || 60), 0);
  }

  private calculateCognitiveLoad(response: any, questionType: string): number {
    // Calcul basé sur la complexité de la question
    const baseLoad = questionType === 'mcq' ? 2 : questionType === 'true-false' ? 1 : 3;
    const textComplexity = response.question.length > 100 ? 1.5 : 1;
    return baseLoad * textComplexity;
  }

  private calculateEstimatedTime(response: any, questionType: string): number {
    // Temps estimé en secondes
    const baseTimes = {
      'mcq': 60,
      'true-false': 30,
      'short-answer': 90,
      'matching': 120
    };
    
    return baseTimes[questionType as keyof typeof baseTimes] || 60;
  }

  private calculateSuggestedPoints(difficulty: string): number {
    const pointsMap = {
      'easy': 1,
      'medium': 2,
      'hard': 3
    };
    
    return pointsMap[difficulty as keyof typeof pointsMap] || 1;
  }

  private evaluateClarity(question: GeneratedQuestion): number {
    // Évaluation de la clarté basée sur la longueur et la complexité
    const questionLength = question.question.length;
    const hasAmbiguousWords = /peut-être|parfois|souvent|généralement/i.test(question.question);
    
    let score = 0.8;
    if (questionLength > 200) score -= 0.2;
    if (hasAmbiguousWords) score -= 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private evaluateDifficulty(question: GeneratedQuestion): number {
    // Évaluation de la pertinence du niveau de difficulté
    return 0.8; // Implémentation simplifiée
  }

  private evaluateRelevance(question: GeneratedQuestion): number {
    // Évaluation de la pertinence par rapport au contenu source
    return 0.8; // Implémentation simplifiée
  }

  private evaluateUniqueness(question: GeneratedQuestion): number {
    // Évaluation de l'unicité de la question
    return 0.8; // Implémentation simplifiée
  }

  private identifyIssues(question: GeneratedQuestion): string[] {
    const issues: string[] = [];
    
    if (question.question.length > 250) {
      issues.push('Question trop longue');
    }
    
    if (question.type === 'mcq' && question.options && question.options.length !== 4) {
      issues.push('Nombre d\'options incorrect pour un QCM');
    }
    
    return issues;
  }

  private generateSuggestions(question: GeneratedQuestion): string[] {
    const suggestions: string[] = [];
    
    if (question.question.length > 200) {
      suggestions.push('Raccourcir la question pour plus de clarté');
    }
    
    if (!question.explanation) {
      suggestions.push('Ajouter une explication détaillée');
    }
    
    return suggestions;
  }

  private generateLearningObjectives(questions: GeneratedQuestion[]): string[] {
    const concepts = [...new Set(questions.map(q => q.concept))];
    return concepts.map(concept => `Maîtriser les concepts liés à ${concept}`);
  }

  private generatePrerequisites(
    analysisResult: PDFAnalysisResult,
    questions: GeneratedQuestion[]
  ): string[] {
    // Génération simplifiée des prérequis
    return ['Connaissances de base du domaine', 'Lecture du document source'];
  }
}
