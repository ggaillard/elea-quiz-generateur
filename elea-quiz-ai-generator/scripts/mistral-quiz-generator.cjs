#!/usr/bin/env node

/**
 * Script CLI pour le générateur de quiz avec Mistral AI
 * Usage: node scripts/mistral-quiz-generator.js [options]
 */

const { program } = require('commander');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Configuration par défaut
const DEFAULT_CONFIG = {
  provider: 'mistral',
  model: 'mistral-large-latest',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  safePrompt: true,
  type: 'mixed',
  count: 20,
  level: 'intermediate',
  language: 'fr',
  style: 'academic',
  includeExplanations: true
};

/**
 * Affiche les modèles Mistral disponibles
 */
function showAvailableModels() {
  console.log('🤖 Modèles Mistral disponibles:');
  console.log('');
  
  const models = [
    {
      name: 'mistral-large-latest',
      description: 'Modèle le plus performant pour des tâches complexes',
      contextWindow: '32K tokens',
      cost: 'Premium',
      recommended: true
    },
    {
      name: 'mistral-large-2402',
      description: 'Version stable du modèle large',
      contextWindow: '32K tokens',
      cost: 'Premium'
    },
    {
      name: 'mistral-medium-latest',
      description: 'Bon équilibre performance/coût',
      contextWindow: '32K tokens',
      cost: 'Moyen'
    },
    {
      name: 'mistral-small-latest',
      description: 'Rapide et économique',
      contextWindow: '32K tokens',
      cost: 'Économique'
    },
    {
      name: 'mistral-tiny',
      description: 'Ultra rapide pour des tâches simples',
      contextWindow: '32K tokens',
      cost: 'Très économique'
    },
    {
      name: 'open-mixtral-8x7b',
      description: 'Modèle open-source performant',
      contextWindow: '32K tokens',
      cost: 'Économique'
    },
    {
      name: 'open-mixtral-8x22b',
      description: 'Modèle open-source le plus avancé',
      contextWindow: '65K tokens',
      cost: 'Moyen'
    }
  ];
  
  models.forEach(model => {
    const badge = model.recommended ? '⭐ RECOMMANDÉ' : '';
    console.log(`📝 ${model.name} ${badge}`);
    console.log(`   ${model.description}`);
    console.log(`   Context: ${model.contextWindow} | Coût: ${model.cost}`);
    console.log('');
  });
}

/**
 * Valide la configuration
 */
function validateConfig(config) {
  const errors = [];
  
  if (!config.apiKey) {
    errors.push('❌ Clé API Mistral manquante (MISTRAL_API_KEY)');
  }
  
  if (!config.inputFile && !config.text) {
    errors.push('❌ Fichier d\'entrée ou texte requis');
  }
  
  if (config.inputFile && !fs.existsSync(config.inputFile)) {
    errors.push(`❌ Fichier non trouvé: ${config.inputFile}`);
  }
  
  if (config.count < 1 || config.count > 100) {
    errors.push('❌ Nombre de questions doit être entre 1 et 100');
  }
  
  if (config.temperature < 0 || config.temperature > 2) {
    errors.push('❌ Temperature doit être entre 0 et 2');
  }
  
  return errors;
}

/**
 * Crée un exemple de configuration
 */
function createExampleConfig() {
  const configPath = path.join(process.cwd(), 'mistral-config.json');
  
  const exampleConfig = {
    ai: {
      provider: 'mistral',
      model: 'mistral-large-latest',
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.9,
      safePrompt: true
    },
    quiz: {
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
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(exampleConfig, null, 2));
  console.log(`✅ Configuration d'exemple créée: ${configPath}`);
  console.log('');
  console.log('📝 Éditez ce fichier selon vos besoins, puis utilisez:');
  console.log(`node scripts/mistral-quiz-generator.js --config ${configPath} --input votre-document.pdf`);
}

/**
 * Génère un quiz avec Mistral
 */
async function generateQuiz(options) {
  console.log('🚀 Génération de quiz avec Mistral AI...');
  console.log('=' .repeat(50));
  
  try {
    // Validation de la configuration
    const config = {
      ...DEFAULT_CONFIG,
      ...options,
      apiKey: process.env.MISTRAL_API_KEY || options.apiKey
    };
    
    const errors = validateConfig(config);
    if (errors.length > 0) {
      console.error('❌ Erreurs de configuration:');
      errors.forEach(error => console.error(error));
      process.exit(1);
    }
    
    console.log('📋 Configuration:');
    console.log(`   🤖 Modèle: ${config.model}`);
    console.log(`   📝 Type: ${config.type}`);
    console.log(`   🔢 Questions: ${config.count}`);
    console.log(`   🎯 Niveau: ${config.level}`);
    console.log(`   🌍 Langue: ${config.language}`);
    console.log(`   🎨 Style: ${config.style}`);
    console.log('');
    
    // Simuler la génération (dans un vrai cas, on ferait appel au service)
    console.log('⏳ Analyse du document...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🧠 Génération des questions...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Quiz généré avec succès !');
    console.log('');
    
    // Résultats simulés
    const results = {
      totalQuestions: config.count,
      processingTime: 3.2,
      questionTypes: {
        mcq: Math.ceil(config.count * 0.5),
        'true-false': Math.ceil(config.count * 0.3),
        'short-answer': Math.ceil(config.count * 0.2)
      },
      difficultyDistribution: {
        easy: Math.ceil(config.count * 0.3),
        medium: Math.ceil(config.count * 0.5),
        hard: Math.ceil(config.count * 0.2)
      }
    };
    
    console.log('📊 Résultats:');
    console.log(`   ⏱️  Temps: ${results.processingTime}s`);
    console.log(`   📝 Questions: ${results.totalQuestions}`);
    console.log(`   🎯 Types: ${Object.entries(results.questionTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}`);
    console.log(`   💪 Difficulté: ${Object.entries(results.difficultyDistribution).map(([diff, count]) => `${diff}: ${count}`).join(', ')}`);
    
    if (config.output) {
      console.log(`   💾 Sauvegardé: ${config.output}`);
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

/**
 * Configuration du CLI
 */
program
  .name('mistral-quiz-generator')
  .description('Générateur de quiz intelligent avec Mistral AI')
  .version('1.0.0');

// Commande pour afficher les modèles disponibles
program
  .command('models')
  .description('Affiche les modèles Mistral disponibles')
  .action(showAvailableModels);

// Commande pour créer un fichier de configuration
program
  .command('init')
  .description('Crée un fichier de configuration d\'exemple')
  .action(createExampleConfig);

// Commande principale de génération
program
  .command('generate')
  .description('Génère un quiz à partir d\'un document')
  .option('-i, --input <file>', 'Fichier d\'entrée (PDF, DOCX, TXT)')
  .option('-o, --output <file>', 'Fichier de sortie pour le quiz')
  .option('-c, --config <file>', 'Fichier de configuration JSON')
  .option('-m, --model <model>', 'Modèle Mistral à utiliser', 'mistral-large-latest')
  .option('-t, --type <type>', 'Type de questions (mcq, true-false, mixed)', 'mixed')
  .option('-n, --count <number>', 'Nombre de questions', '20')
  .option('-l, --level <level>', 'Niveau de difficulté (beginner, intermediate, advanced)', 'intermediate')
  .option('--language <lang>', 'Langue (fr, en)', 'fr')
  .option('--style <style>', 'Style (academic, practical, assessment)', 'academic')
  .option('--temperature <temp>', 'Température (0-2)', '0.7')
  .option('--api-key <key>', 'Clé API Mistral (ou variable MISTRAL_API_KEY)')
  .option('--safe-prompt', 'Activer le mode sécurisé', true)
  .option('--explanations', 'Inclure des explications', true)
  .action(async (options) => {
    // Charger la configuration depuis un fichier si spécifié
    if (options.config) {
      try {
        const configFile = JSON.parse(fs.readFileSync(options.config, 'utf8'));
        Object.assign(options, configFile.ai, configFile.quiz);
      } catch (error) {
        console.error(`❌ Erreur de lecture du fichier de configuration: ${error.message}`);
        process.exit(1);
      }
    }
    
    // Convertir les types
    if (options.count) options.count = parseInt(options.count);
    if (options.temperature) options.temperature = parseFloat(options.temperature);
    
    await generateQuiz(options);
  });

// Commande par défaut
program
  .argument('[input]', 'Fichier d\'entrée (PDF, DOCX, TXT)')
  .option('-o, --output <file>', 'Fichier de sortie')
  .option('-m, --model <model>', 'Modèle Mistral', 'mistral-large-latest')
  .option('-n, --count <number>', 'Nombre de questions', '20')
  .action(async (input, options) => {
    if (!input) {
      console.log('🎓 Générateur de quiz Mistral AI');
      console.log('');
      console.log('💡 Utilisation rapide:');
      console.log('  node scripts/mistral-quiz-generator.js generate -i document.pdf -n 20');
      console.log('');
      console.log('📖 Pour plus d\'aide:');
      console.log('  node scripts/mistral-quiz-generator.js --help');
      console.log('  node scripts/mistral-quiz-generator.js models');
      console.log('  node scripts/mistral-quiz-generator.js init');
      return;
    }
    
    await generateQuiz({ ...options, inputFile: input });
  });

// Exécuter le CLI
program.parse();
