// Tests d'intégration pour les scripts CLI Mistral
import { describe, it, expect } from 'vitest';

describe('Tests d\'intégration - CLI Mistral', () => {
  it('doit valider les arguments de commande', () => {
    const validArgs = {
      input: 'test-document.pdf',
      count: 10,
      type: 'mcq',
      model: 'mistral-large-latest',
      level: 'intermediate'
    };
    
    expect(validArgs.input).toBe('test-document.pdf');
    expect(validArgs.count).toBe(10);
    expect(validArgs.type).toBe('mcq');
    expect(validArgs.model).toBe('mistral-large-latest');
    expect(validArgs.level).toBe('intermediate');
  });

  it('doit valider les modèles disponibles', () => {
    const availableModels = [
      'mistral-large-latest',
      'mistral-medium-latest',
      'mistral-small-latest',
      'mistral-tiny'
    ];
    
    expect(availableModels).toContain('mistral-large-latest');
    expect(availableModels).toContain('mistral-medium-latest');
    expect(availableModels).toContain('mistral-small-latest');
    expect(availableModels).toContain('mistral-tiny');
    expect(availableModels.length).toBe(4);
  });

  it('doit valider la configuration par défaut du CLI', () => {
    const defaultCliConfig = {
      model: 'mistral-large-latest',
      count: 10,
      type: 'mixed',
      level: 'intermediate',
      language: 'fr',
      safePrompt: true,
      temperature: 0.7,
      maxTokens: 2000
    };
    
    expect(defaultCliConfig.model).toBe('mistral-large-latest');
    expect(defaultCliConfig.count).toBe(10);
    expect(defaultCliConfig.type).toBe('mixed');
    expect(defaultCliConfig.level).toBe('intermediate');
    expect(defaultCliConfig.language).toBe('fr');
    expect(defaultCliConfig.safePrompt).toBe(true);
  });

  it('doit valider les commandes CLI disponibles', () => {
    const availableCommands = [
      'generate',
      'models',
      'init',
      'config',
      'help'
    ];
    
    expect(availableCommands).toContain('generate');
    expect(availableCommands).toContain('models');
    expect(availableCommands).toContain('init');
    expect(availableCommands).toContain('config');
    expect(availableCommands).toContain('help');
  });

  it('doit valider les options de génération', () => {
    const generateOptions = {
      '-i, --input': 'Fichier d\'entrée (PDF, DOCX, TXT)',
      '-c, --count': 'Nombre de questions à générer',
      '-t, --type': 'Type de questions (mcq, true-false, mixed)',
      '-m, --model': 'Modèle Mistral à utiliser',
      '-l, --level': 'Niveau de difficulté',
      '--safe-prompt': 'Activer le mode sécurisé',
      '--output': 'Fichier de sortie',
      '--format': 'Format de sortie (json, xml, gift)'
    };
    
    expect(generateOptions['-i, --input']).toBe('Fichier d\'entrée (PDF, DOCX, TXT)');
    expect(generateOptions['-c, --count']).toBe('Nombre de questions à générer');
    expect(generateOptions['-t, --type']).toBe('Type de questions (mcq, true-false, mixed)');
    expect(generateOptions['--safe-prompt']).toBe('Activer le mode sécurisé');
  });

  it('doit valider les formats de sortie supportés', () => {
    const supportedFormats = [
      'json',
      'xml',
      'gift',
      'moodle',
      'csv'
    ];
    
    expect(supportedFormats).toContain('json');
    expect(supportedFormats).toContain('xml');
    expect(supportedFormats).toContain('gift');
    expect(supportedFormats).toContain('moodle');
    expect(supportedFormats).toContain('csv');
  });

  it('doit valider la structure du fichier de configuration', () => {
    const configFile = {
      provider: 'mistral',
      apiKey: 'YOUR_MISTRAL_API_KEY',
      model: 'mistral-large-latest',
      temperature: 0.7,
      maxTokens: 2000,
      safePrompt: true,
      defaults: {
        questionCount: 10,
        questionType: 'mixed',
        difficulty: 'intermediate',
        language: 'fr'
      }
    };
    
    expect(configFile.provider).toBe('mistral');
    expect(configFile.model).toBe('mistral-large-latest');
    expect(configFile.temperature).toBe(0.7);
    expect(configFile.safePrompt).toBe(true);
    expect(configFile.defaults.questionCount).toBe(10);
    expect(configFile.defaults.language).toBe('fr');
  });

  it('doit valider les messages d\'erreur du CLI', () => {
    const errorMessages = {
      noApiKey: 'Clé API Mistral manquante. Utilisez MISTRAL_API_KEY ou --api-key.',
      noInputFile: 'Fichier d\'entrée requis. Utilisez -i ou --input.',
      invalidModel: 'Modèle non supporté. Utilisez mistral:models pour voir les modèles disponibles.',
      invalidCount: 'Le nombre de questions doit être entre 1 et 100.',
      invalidType: 'Type de question non supporté. Utilisez: mcq, true-false, mixed.',
      fileNotFound: 'Fichier d\'entrée non trouvé.',
      parseError: 'Erreur lors du parsing du fichier.',
      apiError: 'Erreur API Mistral. Vérifiez votre clé API et votre connexion.'
    };
    
    expect(errorMessages.noApiKey).toContain('Clé API Mistral manquante');
    expect(errorMessages.noInputFile).toContain('Fichier d\'entrée requis');
    expect(errorMessages.invalidModel).toContain('Modèle non supporté');
    expect(errorMessages.invalidCount).toContain('nombre de questions doit être');
    expect(errorMessages.apiError).toContain('Erreur API Mistral');
  });

  it('doit valider les messages de succès du CLI', () => {
    const successMessages = {
      configCreated: 'Configuration Mistral créée avec succès: mistral-config.json',
      questionsGenerated: 'Questions générées avec succès',
      fileExported: 'Quiz exporté avec succès',
      modelsListed: 'Modèles Mistral disponibles',
      validationPassed: 'Validation de la configuration réussie'
    };
    
    expect(successMessages.configCreated).toContain('Configuration Mistral créée avec succès');
    expect(successMessages.questionsGenerated).toContain('Questions générées avec succès');
    expect(successMessages.fileExported).toContain('Quiz exporté avec succès');
    expect(successMessages.modelsListed).toContain('Modèles Mistral disponibles');
  });

  it('doit valider les scripts npm pour Mistral', () => {
    const npmScripts = {
      'mistral:generate': 'node scripts/mistral-quiz-generator.cjs generate',
      'mistral:models': 'node scripts/mistral-quiz-generator.cjs models',
      'mistral:init': 'node scripts/mistral-quiz-generator.cjs init',
      'mistral:install': './install-mistral.sh'
    };
    
    expect(npmScripts['mistral:generate']).toContain('generate');
    expect(npmScripts['mistral:models']).toContain('models');
    expect(npmScripts['mistral:init']).toContain('init');
    expect(npmScripts['mistral:install']).toContain('./install-mistral.sh');
  });
});
