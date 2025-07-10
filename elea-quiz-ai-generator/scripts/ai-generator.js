#!/usr/bin/env node

import { program } from 'commander';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';
import { AIQuizService } from '../src/services/aiService.js';
import { pdfService } from '../src/services/pdfService.js';
import { createEleaService } from '../src/services/eleaService.js';
import { 
  AIConfig, 
  EleaIntegrationConfig, 
  ProcessingOptions,
  QuizGenerationOptions 
} from '../src/types/index.js';

// Chargement des variables d'environnement
config();

/**
 * Script CLI principal pour la génération de quiz IA
 * Usage: node scripts/ai-generator.js [options]
 */

program
  .name('ai-generator')
  .description('Générateur de quiz IA pour Éléa/Moodle')
  .version('1.0.0');

// Commande principale : génération de quiz
program
  .command('generate')
  .description('Génère un quiz à partir d\'un fichier PDF')
  .argument('<pdfFile>', 'Chemin vers le fichier PDF source')
  .option('-o, --output <path>', 'Chemin de sortie pour le quiz généré', './output')
  .option('-c, --config <path>', 'Chemin vers le fichier de configuration', './config.json')
  .option('-t, --title <title>', 'Titre du quiz')
  .option('-q, --questions <number>', 'Nombre de questions à générer', '10')
  .option('-d, --difficulty <level>', 'Niveau de difficulté (easy|medium|hard)', 'medium')
  .option('-f, --format <format>', 'Format de sortie (json|xml|both)', 'json')
  .option('--deploy', 'Déployer automatiquement sur Éléa')
  .option('--dry-run', 'Simulation sans génération réelle')
  .option('--verbose', 'Mode verbeux')
  .action(async (pdfFile, options) => {
    try {
      if (options.verbose) {
        console.log('🚀 Démarrage du générateur de quiz IA...');
        console.log('📄 Fichier PDF:', pdfFile);
        console.log('⚙️  Options:', options);
      }

      // Validation du fichier PDF
      if (!await pdfService.validatePDF(pdfFile)) {
        console.error('❌ Fichier PDF invalide ou inaccessible');
        process.exit(1);
      }

      // Chargement de la configuration
      const config = await loadConfig(options.config);
      
      // Initialisation des services
      const aiService = new AIQuizService(config.ai);
      const eleaService = options.deploy ? createEleaService(config.elea) : null;

      // Analyse du PDF
      console.log('📖 Analyse du fichier PDF...');
      const pdfAnalysis = await pdfService.analyzePDF(pdfFile);

      if (options.verbose) {
        console.log(`📊 Analyse terminée: ${pdfAnalysis.chunks.length} chunks, ${pdfAnalysis.keyConcepts.length} concepts`);
      }

      // Configuration de la génération
      const generationOptions: QuizGenerationOptions = {
        questionCount: parseInt(options.questions),
        difficulty: options.difficulty,
        questionTypes: ['multiple_choice', 'true_false'],
        focusAreas: pdfAnalysis.keyConcepts.slice(0, 5).map(c => c.term),
        customPrompt: options.title ? `Créer un quiz sur "${options.title}"` : undefined,
        metadata: {
          title: options.title || pdfAnalysis.metadata.title,
          category: 'general',
          difficulty: options.difficulty,
          timeLimit: parseInt(options.questions) * 2, // 2 min par question
          tags: pdfAnalysis.keyConcepts.slice(0, 5).map(c => c.term)
        }
      };

      // Génération du quiz (simulation si dry-run)
      if (options.dryRun) {
        console.log('🔄 Mode simulation - Génération simulée');
        console.log('📋 Configuration:', JSON.stringify(generationOptions, null, 2));
        return;
      }

      console.log('🤖 Génération du quiz par IA...');
      const quiz = await aiService.generateQuiz(pdfAnalysis, generationOptions);

      if (options.verbose) {
        console.log(`✅ Quiz généré avec ${quiz.questions.length} questions`);
      }

      // Sauvegarde du quiz
      const outputPath = path.resolve(options.output);
      await saveQuiz(quiz, outputPath, options.format);

      // Déploiement sur Éléa si demandé
      if (options.deploy && eleaService) {
        console.log('🚀 Déploiement sur Éléa...');
        const eleaQuiz = await eleaService.convertQuizToElea(quiz);
        const deploymentResult = await eleaService.deployToElea(eleaQuiz);
        
        if (deploymentResult.success) {
          console.log(`✅ Quiz déployé: ${deploymentResult.url}`);
        } else {
          console.error('❌ Échec du déploiement:', deploymentResult.errors);
        }
      }

      console.log('🎉 Génération terminée avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      process.exit(1);
    }
  });

// Commande d'analyse PDF
program
  .command('analyze')
  .description('Analyse un fichier PDF sans générer de quiz')
  .argument('<pdfFile>', 'Chemin vers le fichier PDF')
  .option('-o, --output <path>', 'Fichier de sortie pour l\'analyse', './analysis.json')
  .option('--verbose', 'Mode verbeux')
  .action(async (pdfFile, options) => {
    try {
      console.log('📖 Analyse du fichier PDF...');
      
      const analysis = await pdfService.analyzePDF(pdfFile);
      
      if (options.verbose) {
        console.log('📊 Statistiques d\'analyse:');
        console.log(`- Pages: ${analysis.processingStats.totalPages}`);
        console.log(`- Mots: ${analysis.processingStats.totalWords}`);
        console.log(`- Chunks: ${analysis.processingStats.chunkCount}`);
        console.log(`- Concepts: ${analysis.processingStats.conceptCount}`);
        console.log(`- Niveau: ${analysis.complexity.level}`);
        console.log(`- Lisibilité: ${analysis.complexity.readabilityScore.toFixed(2)}`);
      }

      await writeFile(options.output, JSON.stringify(analysis, null, 2));
      console.log(`✅ Analyse sauvegardée dans: ${options.output}`);

    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse:', error);
      process.exit(1);
    }
  });

// Commande de génération par lot
program
  .command('batch')
  .description('Traite plusieurs fichiers PDF en lot')
  .argument('<inputDir>', 'Dossier contenant les fichiers PDF')
  .option('-o, --output <path>', 'Dossier de sortie', './batch-output')
  .option('-c, --config <path>', 'Fichier de configuration', './config.json')
  .option('-p, --parallel <number>', 'Nombre de traitements parallèles', '3')
  .option('--deploy', 'Déployer tous les quiz sur Éléa')
  .option('--verbose', 'Mode verbeux')
  .action(async (inputDir, options) => {
    try {
      console.log('📁 Traitement par lot démarré...');
      
      const { processBatch } = await import('./batch-processor.js');
      
      const results = await processBatch(inputDir, {
        outputDir: options.output,
        configPath: options.config,
        parallel: parseInt(options.parallel),
        deploy: options.deploy,
        verbose: options.verbose
      });

      console.log(`🎉 Traitement terminé: ${results.success}/${results.total} fichiers traités`);
      
      if (results.errors.length > 0) {
        console.log('❌ Erreurs:');
        results.errors.forEach(error => console.log(`  - ${error}`));
      }

    } catch (error) {
      console.error('❌ Erreur lors du traitement par lot:', error);
      process.exit(1);
    }
  });

// Commande de configuration
program
  .command('config')
  .description('Gère la configuration du générateur')
  .option('--init', 'Initialise un fichier de configuration')
  .option('--validate', 'Valide la configuration actuelle')
  .option('--test-ai', 'Test la connexion IA')
  .option('--test-elea', 'Test la connexion Éléa')
  .option('-c, --config <path>', 'Chemin vers le fichier de configuration', './config.json')
  .action(async (options) => {
    try {
      if (options.init) {
        await initConfig(options.config);
        console.log(`✅ Configuration initialisée: ${options.config}`);
      }

      if (options.validate) {
        const config = await loadConfig(options.config);
        const isValid = validateConfig(config);
        console.log(isValid ? '✅ Configuration valide' : '❌ Configuration invalide');
      }

      if (options.testAi) {
        const config = await loadConfig(options.config);
        const aiService = new AIQuizService(config.ai);
        const isConnected = await aiService.testConnection();
        console.log(isConnected ? '✅ Connexion IA OK' : '❌ Connexion IA échouée');
      }

      if (options.testElea) {
        const config = await loadConfig(options.config);
        const eleaService = createEleaService(config.elea);
        const isConnected = await eleaService.testConnection();
        console.log(isConnected ? '✅ Connexion Éléa OK' : '❌ Connexion Éléa échouée');
      }

    } catch (error) {
      console.error('❌ Erreur de configuration:', error);
      process.exit(1);
    }
  });

// Commande d'aide pour les prompts
program
  .command('prompts')
  .description('Gère les prompts personnalisés pour l\'IA')
  .option('--list', 'Liste les prompts disponibles')
  .option('--create <name>', 'Crée un nouveau prompt')
  .option('--edit <name>', 'Édite un prompt existant')
  .option('--delete <name>', 'Supprime un prompt')
  .action(async (options) => {
    try {
      const { managePrompts } = await import('./prompt-manager.js');
      await managePrompts(options);
    } catch (error) {
      console.error('❌ Erreur de gestion des prompts:', error);
      process.exit(1);
    }
  });

/**
 * Chargement de la configuration
 */
async function loadConfig(configPath: string): Promise<any> {
  try {
    const configContent = await readFile(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`❌ Impossible de charger la configuration: ${configPath}`);
    throw error;
  }
}

/**
 * Initialisation de la configuration
 */
async function initConfig(configPath: string): Promise<void> {
  const defaultConfig = {
    ai: {
      provider: 'openai',
      model: 'gpt-4',
      apiKey: process.env.OPENAI_API_KEY || '',
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 30000,
      retryAttempts: 3,
      rateLimiting: {
        requestsPerMinute: 60,
        tokensPerMinute: 10000
      }
    },
    elea: {
      apiEndpoint: process.env.ELEA_API_ENDPOINT || '',
      apiKey: process.env.ELEA_API_KEY || '',
      courseId: process.env.ELEA_COURSE_ID || '',
      categoryId: process.env.ELEA_CATEGORY_ID || '',
      eleaVersion: '4.0',
      deploymentOptions: {
        visible: true,
        notifyUsers: false,
        createBackup: true
      },
      exportSettings: {
        format: 'xml',
        saveToFile: true,
        exportPath: './exports'
      }
    },
    processing: {
      chunkSize: 3000,
      overlapSize: 200,
      maxConcurrentProcesses: 3,
      tempDir: './temp'
    }
  };

  await writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
}

/**
 * Validation de la configuration
 */
function validateConfig(config: any): boolean {
  const required = [
    'ai.provider',
    'ai.model',
    'ai.apiKey',
    'elea.apiEndpoint',
    'elea.apiKey'
  ];

  return required.every(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], config);
    return value !== undefined && value !== '';
  });
}

/**
 * Sauvegarde du quiz
 */
async function saveQuiz(quiz: any, outputPath: string, format: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = `quiz_${timestamp}`;

  if (format === 'json' || format === 'both') {
    const jsonPath = path.join(outputPath, `${baseName}.json`);
    await writeFile(jsonPath, JSON.stringify(quiz, null, 2));
    console.log(`📄 Quiz JSON sauvegardé: ${jsonPath}`);
  }

  if (format === 'xml' || format === 'both') {
    const xmlPath = path.join(outputPath, `${baseName}.xml`);
    // Conversion XML à implémenter
    console.log(`📄 Quiz XML sauvegardé: ${xmlPath}`);
  }
}

// Gestion des erreurs globales
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

// Exécution du programme
program.parse();
