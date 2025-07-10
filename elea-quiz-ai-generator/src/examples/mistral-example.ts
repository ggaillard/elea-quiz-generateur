/**
 * Exemple d'utilisation du générateur de quiz avec Mistral AI
 */

import { AIQuizService } from '../services/aiService';
import { createAIConfig, recommendModel } from '../utils/aiConfig';
import { AIConfig, QuizGenerationConfig, PDFAnalysisResult } from '../types';

// Configuration Mistral
const mistralConfig: AIConfig = createAIConfig('mistral', process.env.MISTRAL_API_KEY || '', {
  model: 'mistral-large-latest',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  safePrompt: true
});

// Configuration de génération de quiz
const quizConfig: QuizGenerationConfig = {
  type: 'mixed',
  count: 20,
  level: 'intermediate',
  domain: 'Sciences',
  style: 'academic',
  language: 'fr',
  includeExplanations: true,
  difficultyDistribution: {
    easy: 6,
    medium: 10,
    hard: 4
  }
};

/**
 * Exemple de génération de quiz avec Mistral
 */
async function generateQuizWithMistral() {
  console.log('🚀 Début de génération de quiz avec Mistral AI...');
  
  try {
    // Créer le service IA
    const aiService = new AIQuizService(mistralConfig);
    
    // Exemple de résultat d'analyse PDF (normalement vient du PDFService)
    const mockPDFAnalysis: PDFAnalysisResult = {
      id: 'pdf_123',
      filename: 'cours_sciences.pdf',
      pageCount: 25,
      wordCount: 5000,
      language: 'fr',
      extractedText: 'Contenu du cours de sciences...',
      chunks: [
        {
          id: 'chunk_1',
          content: 'La photosynthèse est le processus par lequel les plantes utilisent la lumière du soleil pour convertir le dioxyde de carbone et l\'eau en glucose et en oxygène. Cette réaction est fondamentale pour la vie sur Terre car elle produit l\'oxygène que nous respirons.',
          pageNumber: 1,
          startPosition: 0,
          endPosition: 200,
          type: 'paragraph',
          context: {
            section: 'Introduction à la photosynthèse',
            chapter: 'Biologie végétale'
          },
          concepts: ['photosynthèse', 'glucose', 'oxygène'],
          keywords: ['plantes', 'lumière', 'dioxyde de carbone', 'eau'],
          semanticScore: 0.9,
          readabilityScore: 0.8
        },
        {
          id: 'chunk_2',
          content: 'Les mitochondries sont les organites responsables de la respiration cellulaire. Elles transforment le glucose en ATP, la molécule d\'énergie utilisée par les cellules. Ce processus consomme de l\'oxygène et produit du dioxyde de carbone.',
          pageNumber: 2,
          startPosition: 200,
          endPosition: 400,
          type: 'paragraph',
          context: {
            section: 'Respiration cellulaire',
            chapter: 'Biologie cellulaire'
          },
          concepts: ['mitochondries', 'respiration cellulaire', 'ATP'],
          keywords: ['organites', 'glucose', 'énergie', 'cellules'],
          semanticScore: 0.85,
          readabilityScore: 0.75
        },
        {
          id: 'chunk_3',
          content: 'L\'équation chimique de la photosynthèse est : 6CO₂ + 6H₂O + énergie lumineuse → C₆H₁₂O₆ + 6O₂. Cette équation montre que six molécules de dioxyde de carbone et six molécules d\'eau, en présence de lumière, produisent une molécule de glucose et six molécules d\'oxygène.',
          pageNumber: 3,
          startPosition: 400,
          endPosition: 600,
          type: 'paragraph',
          context: {
            section: 'Équation de la photosynthèse',
            chapter: 'Biologie végétale'
          },
          concepts: ['équation chimique', 'photosynthèse', 'molécules'],
          keywords: ['CO₂', 'H₂O', 'glucose', 'O₂'],
          semanticScore: 0.95,
          readabilityScore: 0.7
        }
      ],
      metadata: {
        title: 'Cours de Sciences - Biologie',
        author: 'Professeur Martin',
        subject: 'Biologie',
        creator: 'LibreOffice',
        creationDate: new Date('2024-01-15'),
        pageSize: { width: 595, height: 842 },
        encrypted: false,
        permissions: ['print', 'copy']
      },
      concepts: ['photosynthèse', 'respiration cellulaire', 'ATP', 'glucose', 'oxygène'],
      keywords: ['biologie', 'plantes', 'cellules', 'énergie', 'molécules'],
      images: [],
      tables: [],
      analysisDate: new Date(),
      processingTime: 2500
    };
    
    // Générer le quiz
    console.log('📝 Génération du quiz en cours...');
    const quiz = await aiService.generateQuiz(mockPDFAnalysis, quizConfig);
    
    console.log('✅ Quiz généré avec succès !');
    console.log(`📊 Statistiques:`);
    console.log(`- Titre: ${quiz.title}`);
    console.log(`- Questions: ${quiz.questions.length}`);
    console.log(`- Types: ${Object.entries(quiz.metadata.questionTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}`);
    console.log(`- Difficulté: ${Object.entries(quiz.metadata.difficultyDistribution).map(([diff, count]) => `${diff}: ${count}`).join(', ')}`);
    console.log(`- Durée estimée: ${Math.round(quiz.metadata.estimatedDuration / 60)} minutes`);
    console.log(`- Concepts: ${quiz.metadata.concepts.join(', ')}`);
    
    // Afficher quelques questions d'exemple
    console.log('\n🎯 Exemples de questions générées:');
    quiz.questions.slice(0, 3).forEach((question, index) => {
      console.log(`\n--- Question ${index + 1} (${question.type}) ---`);
      console.log(`Q: ${question.question}`);
      
      if (question.type === 'mcq' && question.options) {
        question.options.forEach((option, i) => {
          const marker = i === question.correct ? '✓' : ' ';
          console.log(`${marker} ${String.fromCharCode(65 + i)}. ${option}`);
        });
      } else if (question.type === 'true-false') {
        console.log(`Réponse: ${question.correct ? 'Vrai' : 'Faux'}`);
      }
      
      if (question.explanation) {
        console.log(`💡 Explication: ${question.explanation}`);
      }
      
      console.log(`🏷️ Concept: ${question.concept} | Difficulté: ${question.difficulty} | Score: ${question.qualityScore.toFixed(2)}`);
    });
    
    return quiz;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du quiz:', error);
    throw error;
  }
}

/**
 * Exemple de recommandation de modèle pour différents cas d'usage
 */
function demonstrateModelRecommendation() {
  console.log('\n🎯 Recommandations de modèles Mistral:');
  
  // Pour la génération de quiz basique
  const basicModel = recommendModel('mistral', {
    quality: 'basic',
    maxCost: 0.001
  });
  console.log(`📝 Quiz basique: ${basicModel}`);
  
  // Pour la génération de quiz de haute qualité
  const highQualityModel = recommendModel('mistral', {
    quality: 'excellent',
    features: ['json-mode', 'function-calling']
  });
  console.log(`🎓 Quiz haute qualité: ${highQualityModel}`);
  
  // Pour le traitement de documents longs
  const longDocModel = recommendModel('mistral', {
    maxTokens: 20000,
    quality: 'good'
  });
  console.log(`📄 Documents longs: ${longDocModel}`);
}

/**
 * Fonction principale d'exemple
 */
async function main() {
  console.log('🎓 Démonstration du générateur de quiz avec Mistral AI');
  console.log('=' .repeat(60));
  
  try {
    // Recommandations de modèles
    demonstrateModelRecommendation();
    
    // Génération de quiz
    await generateQuizWithMistral();
    
  } catch (error) {
    console.error('Erreur dans la démonstration:', error);
    process.exit(1);
  }
}

// Exporter pour utilisation dans d'autres fichiers
export {
  generateQuizWithMistral,
  demonstrateModelRecommendation,
  mistralConfig,
  quizConfig
};

// Exécuter si le fichier est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
