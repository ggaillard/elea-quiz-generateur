# 🤖 Éléa Quiz AI Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991.svg?style=for-the-badge&logo=OpenAI&logoColor=white)](https://openai.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral%20AI-FF7000.svg?style=for-the-badge&logo=mistral&logoColor=white)](https://mistral.ai/)

> Générateur de QCM intelligent pour Éléa/Moodle avec analyse automatique de supports de cours PDF grâce à l'IA

## 🎯 Fonctionnalités

### 🔍 Analyse Automatique de PDF
- **Extraction intelligente** : Analyse complète du contenu PDF (texte, images, tableaux)
- **Segmentation sémantique** : Découpage en chunks logiques avec détection de contexte
- **Enrichissement** : Extraction de concepts clés, mots-clés, et méta-données
- **Multi-format** : Support PDF, DOCX, et autres formats de documents

### 🧠 Génération IA de Questions
- **Providers multiples** : OpenAI, Azure OpenAI, **Mistral AI** 🌟
- **Types de questions** : QCM, Vrai/Faux, Réponse courte, Appariement, Drag & Drop
- **Prompts adaptatifs** : Ajustement automatique selon le type de contenu
- **Évaluation qualité** : Scoring automatique et sélection des meilleures questions
- **Personnalisation** : Configuration du niveau, domaine, et style pédagogique
- **Sécurité éducative** : Mode sécurisé Mistral pour filtrer le contenu inapproprié

### 🎓 Intégration Éléa/Moodle
- **Export natif** : Formats XML Moodle, GIFT, et JSON
- **Plugin Éléa** : Installation directe dans l'environnement Éléa
- **API REST** : Déploiement automatique via webhooks
- **Notifications** : Suivi temps réel des générations

### 🚀 Automation & Scripts
- **Traitement par lots** : Analyse multiple de documents
- **CLI intégré** : Commandes en ligne pour l'automation
- **Surveillance** : Monitoring et logs détaillés
- **Backup** : Sauvegarde automatique des quiz générés

## 🏗️ Architecture

```
elea-quiz-ai-generator/
├── 📁 src/
│   ├── 📁 components/          # Composants React UI
│   │   ├── FileUpload.tsx     # Upload de fichiers PDF
│   │   ├── AIProviderSelector.tsx # Configuration IA multi-provider
│   │   ├── QuizGenerator.tsx  # Interface génération
│   │   ├── QuestionReview.tsx # Révision questions
│   │   └── EleaIntegration.tsx # Intégration Éléa
│   ├── 📁 services/           # Services métier
│   │   ├── aiService.ts       # Service IA (OpenAI/Azure/Mistral)
│   │   ├── pdfService.ts      # Analyse PDF
│   │   ├── pdfService.ts      # Analyse PDF
│   │   ├── eleaService.ts     # Intégration Éléa
│   │   └── exportService.ts   # Export formats
│   ├── 📁 types/              # Types TypeScript
│   │   └── index.ts          # Définitions globales
│   ├── 📁 utils/              # Utilitaires
│   │   ├── promptTemplates.ts # Templates prompts IA
│   │   └── validation.ts      # Validation données
│   └── 📁 hooks/              # Hooks React
│       └── useQuizGenerator.ts
├── 📁 server/                 # Backend Node.js
│   ├── index.js              # Serveur Express
│   ├── routes/               # Routes API
│   └── middleware/           # Middlewares
├── 📁 scripts/               # Scripts automation
│   ├── ai-generator.js       # Génération CLI
│   ├── pdf-analyzer.js       # Analyse PDF CLI
│   ├── elea-deploy.js        # Déploiement Éléa
│   └── batch-process.js      # Traitement par lots
├── 📁 elea-plugin/           # Plugin Éléa
│   ├── install.php          # Script installation
│   ├── quiz-ai-generator.php # Plugin principal
│   └── templates/           # Templates Éléa
└── 📁 docs/                 # Documentation
    ├── INTEGRATION.md       # Guide intégration
    ├── API.md              # Documentation API
    └── PROMPTS.md          # Prompts IA
```

## 🛠️ Installation

### Prérequis
- Node.js 18+ et npm/yarn
- Clé API OpenAI ou Azure OpenAI
- Accès à l'environnement Éléa (optionnel)

### Installation rapide
```bash
# Cloner le projet
git clone https://github.com/votre-org/elea-quiz-ai-generator.git
cd elea-quiz-ai-generator

# Installation des dépendances
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrage développement
npm run dev

# Build production
npm run build
```

### Configuration Azure (Recommandé)
```bash
# Variables d'environnement Azure
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection
```

### Configuration Mistral AI 🌟
```bash
# Variables d'environnement Mistral
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_MODEL=mistral-large-latest

# Utilisation avec le CLI Mistral
node scripts/mistral-quiz-generator.js generate -i document.pdf -n 20
node scripts/mistral-quiz-generator.js models
node scripts/mistral-quiz-generator.js init
```

## 🔧 Configuration

### `.env` Configuration
```env
# IA Configuration
OPENAI_API_KEY=sk-your-openai-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Mistral AI Configuration
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_MODEL=mistral-large-latest

# Éléa Integration
ELEA_API_URL=https://your-elea-instance.com/api
ELEA_API_KEY=your-elea-api-key
ELEA_WEBHOOK_SECRET=your-webhook-secret

# Application
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Azure Services (Optional)
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection
AZURE_KEYVAULT_URL=https://your-keyvault.vault.azure.net/
```

## 🌟 Mistral AI - Spécificités

### Avantages de Mistral AI
- **🇪🇺 Souveraineté européenne** : Conformité RGPD native
- **🔒 Sécurité éducative** : Mode sécurisé pour filtrer le contenu inapproprié
- **🎯 Optimisé français** : Performances exceptionnelles en français
- **💰 Économique** : Tarification compétitive
- **⚡ Rapide** : Temps de réponse optimisés

### Modèles Recommandés pour l'Éducation
- **mistral-large-latest** : Pour des quiz complexes et de haute qualité
- **mistral-medium-latest** : Équilibre optimal performance/coût
- **mistral-small-latest** : Pour un usage intensif et économique

### Configuration TypeScript
```typescript
import { createAIConfig } from './utils/aiConfig';

const mistralConfig = createAIConfig('mistral', process.env.MISTRAL_API_KEY!, {
  model: 'mistral-large-latest',
  temperature: 0.7,
  safePrompt: true, // Recommandé pour l'éducation
  maxTokens: 2000
});
```

### CLI Mistral
```bash
# Génération rapide
npm run mistral:generate -- --input cours.pdf --count 25

# Avec paramètres avancés
npm run mistral:generate -- \
  --input cours.pdf \
  --model mistral-large-latest \
  --level advanced \
  --type mixed \
  --safe-prompt

# Voir les modèles disponibles
npm run mistral:models

# Créer un fichier de configuration
npm run mistral:init
```

## 📚 Utilisation

### Interface Web
1. **Upload PDF** : Glisser-déposer ou sélectionner un fichier PDF
2. **Configuration IA** : Choisir type de questions, niveau, nombre
3. **Génération** : Lancer l'analyse et la génération automatique
4. **Révision** : Valider et modifier les questions générées
5. **Export** : Télécharger ou déployer directement dans Éléa

### CLI Usage
```bash
# Génération simple
npm run ai:generate -- --file="cours.pdf" --type="mcq" --count=20

# Analyse PDF détaillée
npm run pdf:analyze -- --file="cours.pdf" --extract-images

# Déploiement Éléa
npm run elea:deploy -- --quiz-id=123 --course-id=456

# Traitement par lots
npm run batch:process -- --folder="./documents" --output="./quizzes"
```

### API REST
```bash
# Upload et génération
curl -X POST http://localhost:3000/api/generate \
  -F "file=@cours.pdf" \
  -F "config={\"type\":\"mcq\",\"count\":20}"

# Statut génération
curl http://localhost:3000/api/status/job-id

# Export quiz
curl http://localhost:3000/api/export/quiz-id?format=moodle
```

## 🎓 Intégration Éléa

### Installation Plugin
```bash
# Copier le plugin dans Éléa
cp -r elea-plugin/ /path/to/elea/plugins/quiz-ai-generator/

# Installer via interface admin Éléa
# Admin -> Plugins -> Quiz AI Generator -> Install
```

### Script PHP d'installation
```php
<?php
// elea-plugin/install.php
// Script d'installation automatique du plugin Éléa
// À exécuter dans l'environnement Éléa
```

### Webhook Configuration
```javascript
// Configuration webhook pour synchronisation temps réel
const webhookConfig = {
  url: 'https://your-elea-instance.com/api/webhook/quiz-ai',
  secret: process.env.ELEA_WEBHOOK_SECRET,
  events: ['quiz.generated', 'quiz.updated', 'quiz.deployed']
};
```

## 🤖 Prompts IA

### Templates de Prompts
Le système utilise des prompts adaptatifs selon le type de contenu :

```typescript
// Prompt pour QCM
const MCQ_PROMPT = `
Analyse le contenu suivant et génère {count} questions à choix multiples.
Contenu: {content}
Niveau: {level}
Domaine: {domain}

Format de réponse JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Explication"
    }
  ]
}
`;
```

### Personnalisation
- **Niveau** : Débutant, Intermédiaire, Avancé
- **Domaine** : Sciences, Littérature, Histoire, etc.
- **Style** : Académique, Pratique, Évaluation
- **Langue** : Français, Anglais, Multilingue

## 📊 Monitoring & Logs

### Surveillance
```bash
# Logs temps réel
tail -f logs/app.log

# Statistiques génération
npm run stats

# Monitoring Azure
# Utilise Azure Application Insights
```

### Métriques
- Nombre de PDF analysés
- Questions générées par type
- Temps de traitement moyen
- Taux de succès déploiement Éléa
- Utilisation API IA

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec UI
npm run test:ui

# Coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 🚀 Déploiement

### Azure App Service
```bash
# Déploiement Azure avec AZD
azd init
azd up

# Ou manuel
az webapp up --name elea-quiz-ai --resource-group rg-elea
```

### Docker
```bash
# Build image
docker build -t elea-quiz-ai .

# Run container
docker run -p 3000:3000 --env-file .env elea-quiz-ai
```

## 📈 Exemples d'utilisation

### Génération automatique
```typescript
import { QuizGenerator } from './services/aiService';

const generator = new QuizGenerator({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
});

// Génération depuis PDF
const quiz = await generator.generateFromPDF('cours.pdf', {
  type: 'mixed',
  count: 25,
  level: 'intermediate'
});

// Déploiement automatique
await eleaService.deployQuiz(quiz, {
  courseId: 123,
  notify: true
});
```

### Traitement par lots
```typescript
import { BatchProcessor } from './services/batchService';

const processor = new BatchProcessor();

// Traitement dossier complet
await processor.processFolder('./documents', {
  outputDir: './quizzes',
  formats: ['moodle', 'gift', 'json'],
  autoUpload: true
});
```

## 🔒 Sécurité

### Bonnes pratiques
- **Authentification** : Utilisation d'Azure Managed Identity
- **Chiffrement** : Stockage sécurisé des clés dans Azure Key Vault
- **Validation** : Validation stricte des uploads et données
- **Logs** : Audit trail complet des opérations

### Azure Security
```typescript
// Utilisation Managed Identity
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const openAIClient = new OpenAIClient(endpoint, credential);
```

## 📞 Support

### Documentation
- [Guide d'intégration Mistral](./docs/MISTRAL_INTEGRATION.md)
- [Documentation complète](./docs/COMPLETE_DOCUMENTATION.md)
- [Diagrammes architecture](./docs/diagrams/)

### Contribution
1. Fork le projet
2. Créer une branche feature
3. Committer les changements
4. Ouvrir une Pull Request


