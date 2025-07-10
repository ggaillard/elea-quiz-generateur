/**
 * Script d'automatisation pour la prise de captures d'écran
 * Utilise Puppeteer pour automatiser la génération des images de documentation
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:3000',
  screenshotsDir: path.join(__dirname, 'screenshots'),
  devices: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 1024, height: 768 },
    mobile: { width: 375, height: 667 }
  }
};

// Données de démonstration
const demoData = {
  quiz: {
    name: "Quiz de Géographie",
    description: "Testez vos connaissances en géographie mondiale",
    category: "Géographie"
  },
  questions: [
    {
      type: 'mcq',
      title: 'Capitale de la France',
      question: 'Quelle est la capitale de la France ?',
      answers: [
        { text: 'Paris', correct: true },
        { text: 'Lyon', correct: false },
        { text: 'Marseille', correct: false },
        { text: 'Toulouse', correct: false }
      ]
    },
    {
      type: 'truefalse',
      title: 'Mont Everest',
      question: 'Le Mont Everest est le plus haut sommet du monde.',
      answer: true
    },
    {
      type: 'matching',
      title: 'Capitales européennes',
      question: 'Associez chaque pays à sa capitale :',
      pairs: [
        { question: 'France', answer: 'Paris' },
        { question: 'Italie', answer: 'Rome' },
        { question: 'Espagne', answer: 'Madrid' },
        { question: 'Allemagne', answer: 'Berlin' }
      ]
    },
    {
      type: 'shortanswer',
      title: 'Fleuve le plus long',
      question: 'Quel est le fleuve le plus long du monde ?',
      answers: ['Nil', 'Le Nil', 'nil']
    }
  ]
};

class ScreenshotAutomator {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Initialisation du navigateur...');
    this.browser = await puppeteer.launch({
      headless: false, // Mode visible pour debug
      defaultViewport: null,
      args: ['--start-maximized']
    });

    this.page = await this.browser.newPage();
    await this.page.goto(config.baseUrl);
    await this.page.waitForSelector('body');
    
    console.log('✅ Navigateur initialisé');
  }

  async setViewport(device) {
    await this.page.setViewport(config.devices[device]);
  }

  async screenshot(filename, options = {}) {
    const filePath = path.join(config.screenshotsDir, filename);
    
    // Attendre que la page soit stable
    await this.page.waitForLoadState?.('networkidle') || await this.page.waitForTimeout(1000);
    
    await this.page.screenshot({
      path: filePath,
      fullPage: options.fullPage || false,
      ...options
    });
    
    console.log(`📸 Capture sauvegardée: ${filename}`);
  }

  async setupDemoData() {
    console.log('🎯 Configuration des données de démonstration...');
    
    // Créer le localStorage avec des données de démonstration
    await this.page.evaluate((data) => {
      const storage = {
        quizzes: [{
          id: 'demo-quiz-1',
          name: data.quiz.name,
          description: data.quiz.description,
          category: data.quiz.category,
          questions: data.questions.map((q, i) => ({
            id: `demo-question-${i}`,
            ...q,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
          })),
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          settings: {
            shuffle: true,
            timeLimit: 30,
            attempts: 3,
            gradingMethod: 'highest',
            showFeedback: true,
            showCorrectAnswers: true
          }
        }],
        settings: {
          language: 'fr',
          theme: 'light',
          autoSave: true
        }
      };
      
      localStorage.setItem('quiz-generator-data', JSON.stringify(storage));
    }, demoData);
    
    await this.page.reload();
    console.log('✅ Données de démonstration configurées');
  }

  async takeAllScreenshots() {
    console.log('📸 Début de la prise de captures d\'écran...');
    
    // 1. Écran d'accueil
    await this.setViewport('desktop');
    await this.screenshot('01-home-screen.png');
    
    // 2. Création de quiz
    await this.page.click('[data-testid="new-quiz-button"]');
    await this.page.waitForSelector('[data-testid="quiz-creation-form"]');
    await this.screenshot('02-quiz-creation.png');
    
    // 3. Liste des questions
    await this.page.click('[data-testid="quiz-item"]');
    await this.page.waitForSelector('[data-testid="questions-list"]');
    await this.screenshot('03-questions-list.png');
    
    // 4. Éditeur QCM
    await this.page.click('[data-testid="add-question-button"]');
    await this.page.waitForSelector('[data-testid="question-editor"]');
    await this.page.select('[data-testid="question-type"]', 'mcq');
    await this.screenshot('04-mcq-editor.png');
    
    // 5. Éditeur Vrai/Faux
    await this.page.select('[data-testid="question-type"]', 'truefalse');
    await this.screenshot('05-truefalse-editor.png');
    
    // 6. Éditeur Appariement
    await this.page.select('[data-testid="question-type"]', 'matching');
    await this.screenshot('06-matching-editor.png');
    
    // 7. Aperçu question
    await this.page.click('[data-testid="preview-question-button"]');
    await this.page.waitForSelector('[data-testid="question-preview"]');
    await this.screenshot('07-question-preview.png');
    
    // 8. Aperçu quiz
    await this.page.click('[data-testid="preview-quiz-button"]');
    await this.page.waitForSelector('[data-testid="quiz-preview"]');
    await this.screenshot('08-quiz-preview.png');
    
    // 9. Panel d'export
    await this.page.click('[data-testid="export-button"]');
    await this.page.waitForSelector('[data-testid="export-panel"]');
    await this.screenshot('09-export-panel.png');
    
    // 10. Panel d'import
    await this.page.click('[data-testid="import-button"]');
    await this.page.waitForSelector('[data-testid="import-panel"]');
    await this.screenshot('10-import-panel.png');
    
    // 11. Version mobile
    await this.setViewport('mobile');
    await this.page.goto(config.baseUrl);
    await this.page.waitForSelector('body');
    await this.screenshot('11-mobile-view.png');
    
    // 12. Version tablette
    await this.setViewport('tablet');
    await this.page.goto(config.baseUrl);
    await this.page.waitForSelector('body');
    await this.screenshot('12-tablet-view.png');
    
    // 13. Thème sombre (si disponible)
    await this.setViewport('desktop');
    await this.page.goto(config.baseUrl);
    await this.page.waitForSelector('body');
    
    // Activer le thème sombre
    await this.page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await this.screenshot('13-dark-theme.png');
    
    console.log('✅ Toutes les captures d\'écran ont été prises');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Navigateur fermé');
    }
  }
}

// Fonction principale
async function main() {
  const automator = new ScreenshotAutomator();
  
  try {
    // Créer le dossier screenshots s'il n'existe pas
    if (!fs.existsSync(config.screenshotsDir)) {
      fs.mkdirSync(config.screenshotsDir, { recursive: true });
    }
    
    await automator.init();
    await automator.setupDemoData();
    await automator.takeAllScreenshots();
    
    console.log('🎉 Toutes les captures d\'écran ont été générées avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération des captures d\'écran:', error);
  } finally {
    await automator.cleanup();
  }
}

// Fonction pour installer les dépendances
function installDependencies() {
  console.log('📦 Installation des dépendances...');
  const { execSync } = require('child_process');
  
  try {
    execSync('npm install --save-dev puppeteer', { stdio: 'inherit' });
    console.log('✅ Puppeteer installé');
  } catch (error) {
    console.error('❌ Erreur lors de l\'installation de Puppeteer:', error);
  }
}

// Vérifier si Puppeteer est installé
try {
  require('puppeteer');
  main();
} catch (error) {
  console.log('⚠️  Puppeteer n\'est pas installé.');
  console.log('Voulez-vous l\'installer maintenant ? (y/n)');
  
  process.stdin.once('data', (data) => {
    if (data.toString().trim().toLowerCase() === 'y') {
      installDependencies();
      setTimeout(() => {
        main();
      }, 5000);
    } else {
      console.log('❌ Installation annulée. Installez Puppeteer manuellement :');
      console.log('npm install --save-dev puppeteer');
    }
  });
}

module.exports = ScreenshotAutomator;
