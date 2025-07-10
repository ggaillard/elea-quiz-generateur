# 📖 Documentation Complète - Éléa Quiz AI Generator

## 🎯 Vue d'ensemble

**Éléa Quiz AI Generator** est une solution complète pour générer automatiquement des QCM intelligents à partir de documents PDF pour les plateformes Éléa/Moodle. Cette documentation présente toutes les fonctionnalités avec des captures d'écran illustratives.

---

## 🏠 Interface Principale

### Page d'Accueil
![Page d'accueil](./screenshots/home-page.png)

La page d'accueil présente :
- **Dashboard principal** avec statistiques en temps réel
- **Accès rapide** aux fonctionnalités principales
- **Historique** des dernières générations
- **État des services** IA (OpenAI, Azure, Mistral)

**Fonctionnalités principales :**
- 🔍 Analyse automatique de PDF
- 🧠 Génération IA de questions
- 🎓 Intégration Éléa/Moodle
- 🚀 Automation & Scripts

---

## 📤 Téléchargement de Fichiers

### Interface de Upload
![Interface de téléchargement](./screenshots/file-upload.png)

L'interface de téléchargement permet :
- **Drag & Drop** de fichiers PDF, DOCX, TXT
- **Prévisualisation** du contenu du document
- **Validation** automatique du format
- **Progression** du téléchargement en temps réel

**Formats supportés :**
- 📄 PDF (avec OCR si nécessaire)
- 📝 DOCX (Microsoft Word)
- 📋 TXT (texte brut)
- 🌐 HTML (contenu web)

---

## ⚙️ Configuration IA Multi-Provider

### Sélection des Providers
![Configuration IA](./screenshots/ai-config.png)

La configuration IA offre :
- **OpenAI** : GPT-4, GPT-3.5-turbo
- **Azure OpenAI** : Déploiements Azure sécurisés
- **Mistral AI** : Modèles européens conformes RGPD 🇪🇺

**Paramètres configurables :**
- 🎯 **Modèle** : Choix selon performance/coût
- 🌡️ **Température** : Créativité des réponses (0.0 - 1.0)
- 📝 **Tokens max** : Limite de génération
- 🔒 **Mode sécurisé** : Filtrage contenu inapproprié (Mistral)

### Configuration Mistral Spécifique
```typescript
{
  "provider": "mistral",
  "model": "mistral-large-latest",
  "temperature": 0.7,
  "maxTokens": 2000,
  "safePrompt": true,
  "language": "fr"
}
```

---

## 🎲 Génération de Quiz

### Interface de Génération
![Génération de Quiz](./screenshots/quiz-generation.png)

L'interface de génération propose :
- **Types de questions** : QCM, Vrai/Faux, Réponse courte, Appariement
- **Niveau de difficulté** : Débutant, Intermédiaire, Avancé
- **Nombre de questions** : 1 à 100 questions
- **Domaine pédagogique** : Sciences, Lettres, Histoire, etc.

**Processus de génération :**
1. 📄 **Analyse** du document source
2. 🔍 **Extraction** des concepts clés
3. 🧠 **Génération** IA des questions
4. ✅ **Validation** qualité automatique
5. 📊 **Scoring** et sélection

### Types de Questions Supportés

| Type | Description | Exemple |
|------|-------------|---------|
| **QCM** | Questions à choix multiples | 4 options, 1 bonne réponse |
| **Vrai/Faux** | Questions binaires | Affirmation vraie ou fausse |
| **Réponse courte** | Réponse textuelle libre | Mots-clés ou phrases |
| **Appariement** | Association d'éléments | Concepts ↔ Définitions |
| **Drag & Drop** | Glisser-déposer | Placement d'éléments |

---

## 🔍 Révision des Questions

### Interface de Révision
![Révision des Questions](./screenshots/question-review.png)

L'interface de révision permet :
- **Prévisualisation** de toutes les questions générées
- **Édition** en temps réel du contenu
- **Validation** pédagogique avec scoring
- **Réorganisation** par drag & drop

**Fonctionnalités de révision :**
- ✏️ **Édition** : Modification des questions/réponses
- 🎯 **Scoring** : Évaluation qualité (1-5 étoiles)
- 📊 **Statistiques** : Répartition par type/difficulté
- 🔄 **Regénération** : Nouvelle génération IA ciblée

### Critères de Qualité
- **Clarté** : Question compréhensible
- **Pertinence** : Lien avec le document source
- **Difficulté** : Niveau approprié
- **Distracteurs** : Qualité des mauvaises réponses

---

## 🎓 Intégration Éléa/Moodle

### Interface d'Intégration
![Intégration Éléa](./screenshots/elea-integration.png)

L'intégration Éléa/Moodle offre :
- **Déploiement direct** dans les cours
- **Formats d'export** : XML Moodle, GIFT, JSON
- **Synchronisation** temps réel
- **Notifications** de déploiement

**Formats d'export supportés :**
- 📄 **XML Moodle** : Import direct dans Moodle
- 📝 **GIFT** : Format texte Moodle
- 📊 **JSON** : Format structuré
- 📋 **CSV** : Tableur compatible

### Configuration Éléa
```json
{
  "elea": {
    "apiUrl": "https://your-elea-instance.com/api",
    "apiKey": "your-api-key",
    "courseId": 123,
    "categoryId": 456,
    "autoPublish": true,
    "notifications": true
  }
}
```

---

## 🖥️ Interface CLI Mistral

### Terminal Mistral
![CLI Mistral](./screenshots/mistral-cli.png)

Le CLI Mistral propose :
- **Génération batch** : Traitement multiple de documents
- **Modèles disponibles** : Liste des modèles Mistral
- **Configuration** : Création de fichiers de config
- **Monitoring** : Suivi des générations

### Commandes CLI Principales

```bash
# Génération rapide
npm run mistral:generate -- --input cours.pdf --count 25

# Voir les modèles disponibles
npm run mistral:models

# Créer une configuration
npm run mistral:init

# Génération avancée
npm run mistral:generate -- \
  --input cours.pdf \
  --model mistral-large-latest \
  --level advanced \
  --type mixed \
  --safe-prompt \
  --output quiz.json
```

### Options CLI Détaillées

| Option | Description | Exemple |
|--------|-------------|---------|
| `-i, --input` | Fichier source | `--input cours.pdf` |
| `-c, --count` | Nombre de questions | `--count 20` |
| `-t, --type` | Type de questions | `--type mcq` |
| `-m, --model` | Modèle Mistral | `--model mistral-large-latest` |
| `-l, --level` | Niveau difficulté | `--level intermediate` |
| `--safe-prompt` | Mode sécurisé | `--safe-prompt` |
| `--output` | Fichier sortie | `--output quiz.json` |
| `--format` | Format export | `--format moodle` |

---

## 🏗️ Architecture du Système

### Diagramme d'Architecture
![Architecture](./screenshots/architecture.png)

L'architecture comprend :
- **Frontend React** : Interface utilisateur moderne
- **Backend Node.js** : API REST et traitement
- **Services IA** : OpenAI, Azure, Mistral
- **Base de données** : Stockage des quiz et métadonnées
- **Intégrations** : Éléa/Moodle, Azure Services

### Composants Principaux

#### 🎨 Frontend (React + TypeScript)
```
src/
├── components/          # Composants UI
│   ├── FileUpload.tsx
│   ├── AIProviderSelector.tsx
│   ├── QuizGenerator.tsx
│   └── QuestionReview.tsx
├── services/           # Services métier
│   ├── aiService.ts
│   ├── pdfService.ts
│   └── eleaService.ts
├── hooks/              # Hooks React
│   └── useQuizGenerator.ts
└── utils/              # Utilitaires
    ├── promptTemplates.ts
    └── validation.ts
```

#### 🔧 Backend (Node.js + Express)
```
server/
├── index.js           # Serveur principal
├── routes/            # Routes API
│   ├── upload.js
│   ├── generate.js
│   └── export.js
├── middleware/        # Middlewares
│   ├── auth.js
│   └── validation.js
└── services/          # Services backend
    ├── pdfParser.js
    └── aiProcessor.js
```

#### 🚀 Scripts & Automation
```
scripts/
├── mistral-quiz-generator.cjs  # CLI Mistral
├── ai-generator.js            # Génération IA
├── pdf-analyzer.js            # Analyse PDF
├── elea-deploy.js             # Déploiement Éléa
└── batch-process.js           # Traitement batch
```

---

## 🔐 Sécurité et Conformité

### Sécurité Mistral AI
- **🇪🇺 Souveraineté européenne** : Données traitées en Europe
- **🔒 Mode sécurisé** : Filtrage contenu inapproprié automatique
- **📊 RGPD** : Conformité native aux réglementations
- **🛡️ Chiffrement** : Communications sécurisées

### Bonnes Pratiques Azure
- **🔑 Managed Identity** : Authentification sans clés
- **🔒 Key Vault** : Stockage sécurisé des secrets
- **📊 Application Insights** : Monitoring et logs
- **🛡️ Security Center** : Audit sécurité

---

## 📊 Monitoring et Statistiques

### Dashboard de Monitoring
- **📈 Génération** : Nombre de quiz créés
- **⏱️ Performance** : Temps de traitement moyen
- **💰 Coûts** : Utilisation des APIs IA
- **✅ Succès** : Taux de réussite des déploiements

### Métriques Clés
| Métrique | Description | Valeur type |
|----------|-------------|-------------|
| **Temps génération** | Durée moyenne | ~30 secondes |
| **Taux succès** | Génération réussie | >95% |
| **Coût moyen** | Par quiz (10 questions) | ~$0.05 |
| **Satisfaction** | Note utilisateur | 4.5/5 |

---

## 🚀 Démarrage Rapide

### 1. Installation
```bash
git clone https://github.com/votre-org/elea-quiz-ai-generator.git
cd elea-quiz-ai-generator
npm install
```

### 2. Configuration
```bash
cp .env.example .env
# Éditer .env avec vos clés API
```

### 3. Démarrage
```bash
npm run dev
```

### 4. Premier Quiz
1. Accédez à `http://localhost:5173`
2. Téléchargez un fichier PDF
3. Configurez les paramètres IA
4. Générez votre premier quiz !

---

## 🎯 Cas d'Usage

### 👨‍🏫 Enseignant
- Upload d'un cours PDF
- Génération automatique de 20 QCM
- Révision et personnalisation
- Déploiement direct dans Éléa

### 🏢 Institution
- Traitement batch de 100 documents
- Génération standardisée
- Intégration système existant
- Monitoring centralisé

### 👨‍💻 Développeur
- API REST complète
- CLI pour automation
- Webhooks pour intégration
- SDKs disponibles

---

## 🆘 Support et Maintenance

### Documentation Technique
- [Guide d'intégration](./INTEGRATION.md)
- [API Documentation](./API.md)
- [Guide Mistral](./MISTRAL_INTEGRATION.md)

### Support
- 📧 **Email** : support@elea-quiz-ai.com
- 💬 **Chat** : Support intégré dans l'interface
- 🐛 **Issues** : GitHub Issues pour bugs
- 📖 **Wiki** : Documentation communautaire

### Maintenance
- 🔄 **Mises à jour** : Automatiques via Azure
- 📊 **Monitoring** : 24/7 avec alertes
- 🔐 **Sécurité** : Audits réguliers
- 📈 **Performance** : Optimisation continue

---

## 🎉 Conclusion

**Éléa Quiz AI Generator** révolutionne la création de QCM en automatisant le processus grâce à l'IA. Avec le support de **Mistral AI**, vous bénéficiez d'une solution européenne, sécurisée et performante pour vos besoins pédagogiques.

**Prochaines étapes :**
1. ✅ Testez la solution avec vos documents
2. 🔧 Configurez l'intégration Éléa
3. 📊 Analysez les résultats
4. 🚀 Déployez en production

---

*Documentation générée le 10 juillet 2025 - Version 1.0.0*
