# 📚 Documentation Éléa Quiz AI Generator

## 🎯 Vue d'ensemble

Cette documentation complète vous guide dans l'utilisation de **Éléa Quiz AI Generator**, un outil intelligent pour créer automatiquement des QCM à partir de documents PDF grâce à l'IA.

![Architecture](./screenshots/architecture.png)

---

## 📖 Documents Disponibles

### 🚀 Guides Principaux

| Document | Description | Audience |
|----------|-------------|----------|
| **[Documentation Complète](./DOCUMENTATION_COMPLETE.md)** | Vue d'ensemble avec captures d'écran | Tous utilisateurs |
| **[Guide d'Utilisation](./GUIDE_UTILISATION.md)** | Tutoriels pas-à-pas avec exemples | Utilisateurs finaux |
| **[Intégration Mistral](./MISTRAL_INTEGRATION.md)** | Guide spécifique Mistral AI | Administrateurs |
| **[Guide Complet Mistral](../MISTRAL_COMPLETE.md)** | Documentation technique complète | Développeurs |

### 🔧 Références Techniques

| Document | Description | Audience |
|----------|-------------|----------|
| **[API Documentation](./API.md)** | Référence API REST | Développeurs |
| **[Guide d'Intégration](./INTEGRATION.md)** | Intégration systèmes existants | Administrateurs |
| **[Prompts IA](./PROMPTS.md)** | Templates et optimisation | Experts IA |

---

## 🖼️ Captures d'Écran

### Interface Utilisateur
- **[Page d'accueil](./screenshots/home-page.png)** - Dashboard principal
- **[Upload de fichiers](./screenshots/file-upload.png)** - Interface téléchargement
- **[Configuration IA](./screenshots/ai-config.png)** - Paramètres des providers
- **[Génération de quiz](./screenshots/quiz-generation.png)** - Interface de génération
- **[Révision des questions](./screenshots/question-review.png)** - Édition et validation
- **[Intégration Éléa](./screenshots/elea-integration.png)** - Déploiement Éléa/Moodle

### CLI et Architecture
- **[CLI Mistral](./screenshots/mistral-cli.png)** - Interface en ligne de commande
- **[Architecture](./screenshots/architecture.png)** - Diagramme du système

---

## 🎯 Guides par Cas d'Usage

### 👨‍🏫 Enseignants
1. **[Démarrage Rapide](./GUIDE_UTILISATION.md#-démarrage-rapide)** - Installation et première utilisation
2. **[Interface Web](./GUIDE_UTILISATION.md#-interface-web)** - Utilisation de l'interface graphique
3. **[Intégration Éléa](./GUIDE_UTILISATION.md#-intégration-éléa)** - Déploiement dans Éléa/Moodle

### 👨‍💼 Administrateurs
1. **[Configuration Mistral](./MISTRAL_INTEGRATION.md#-configuration)** - Paramétrage initial
2. **[Déploiement](./MISTRAL_INTEGRATION.md#-déploiement)** - Installation serveur
3. **[Monitoring](./MISTRAL_INTEGRATION.md#-monitoring)** - Surveillance et maintenance

### 👨‍💻 Développeurs
1. **[CLI Mistral](./GUIDE_UTILISATION.md#-cli-mistral)** - Automatisation par scripts
2. **[API REST](./API.md)** - Intégration programmatique
3. **[Architecture](./DOCUMENTATION_COMPLETE.md#-architecture-du-système)** - Composants techniques

---

## 🌟 Fonctionnalités Principales

### 🔍 Analyse Automatique
- **Extraction PDF** - Analyse complète des documents
- **Segmentation** - Découpage intelligent du contenu
- **Enrichissement** - Extraction de concepts clés

### 🧠 Génération IA
- **Multi-providers** - OpenAI, Azure, **Mistral AI** 🇪🇺
- **Types variés** - QCM, Vrai/Faux, Réponse courte
- **Qualité garantie** - Scoring et validation automatique

### 🎓 Intégration Éléa
- **Export natif** - XML Moodle, GIFT, JSON
- **Déploiement direct** - API Éléa/Moodle
- **Notifications** - Suivi temps réel

### 🚀 Automation
- **CLI complet** - Scripts d'automatisation
- **Traitement batch** - Analyse multiple
- **Monitoring** - Logs et métriques

---

## 🇪🇺 Spécificités Mistral AI

### Avantages
- **Souveraineté européenne** - Conformité RGPD
- **Mode sécurisé** - Filtrage éducatif
- **Optimisé français** - Performances exceptionnelles
- **Économique** - Tarification compétitive

### Modèles Disponibles
- `mistral-large-latest` - Qualité maximale
- `mistral-medium-latest` - Équilibre optimal
- `mistral-small-latest` - Usage intensif
- `mistral-tiny` - Tests et prototypage

### Configuration Recommandée
```json
{
  "provider": "mistral",
  "model": "mistral-large-latest",
  "temperature": 0.7,
  "maxTokens": 2000,
  "safePrompt": true
}
```

---

## 🚀 Installation Rapide

### 1. Clonage et Installation
```bash
git clone https://github.com/votre-org/elea-quiz-ai-generator.git
cd elea-quiz-ai-generator
npm install
```

### 2. Configuration
```bash
cp .env.example .env
# Éditer .env avec votre clé Mistral
```

### 3. Démarrage
```bash
npm run dev
```

### 4. Test CLI
```bash
npm run mistral:models
npm run mistral:init
```

---

## 📊 Exemples d'Utilisation

### Interface Web
```bash
# Démarrer l'interface
npm run dev
# Ouvrir http://localhost:5173
```

### CLI Mistral
```bash
# Génération simple
npm run mistral:generate -- --input cours.pdf --count 20

# Génération avancée
npm run mistral:generate -- \
  --input cours.pdf \
  --model mistral-large-latest \
  --level advanced \
  --safe-prompt \
  --format moodle
```

### API REST
```bash
# Upload et génération
curl -X POST http://localhost:3000/api/generate \
  -F "file=@cours.pdf" \
  -F "config={\"provider\":\"mistral\",\"count\":20}"
```

---

## 🔧 Configuration Avancée

### Variables d'Environnement
```env
# Mistral AI
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_MODEL=mistral-large-latest

# Éléa/Moodle
ELEA_API_URL=https://elea.ac-toulouse.fr/api
ELEA_API_KEY=your-elea-api-key

# Azure (optionnel)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-key
```

### Fichier de Configuration
```json
{
  "providers": {
    "mistral": {
      "apiKey": "$MISTRAL_API_KEY",
      "model": "mistral-large-latest",
      "temperature": 0.7,
      "safePrompt": true
    }
  },
  "defaults": {
    "questionCount": 15,
    "questionType": "mixed",
    "difficulty": "intermediate"
  }
}
```

---

## 🆘 Support et Maintenance

### Support Technique
- **📧 Email** : support@elea-quiz-ai.com
- **💬 Discord** : [Communauté](https://discord.gg/elea-quiz-ai)
- **🐛 Issues** : [GitHub Issues](https://github.com/votre-org/elea-quiz-ai-generator/issues)

### Maintenance
- **🔄 Mises à jour** : Automatiques
- **📊 Monitoring** : 24/7
- **🔐 Sécurité** : Audits réguliers
- **📈 Performance** : Optimisation continue

### Ressources Externes
- **[Mistral AI](https://mistral.ai/)** - Documentation officielle
- **[OpenAI](https://openai.com/)** - API Reference
- **[Azure OpenAI](https://azure.microsoft.com/fr-fr/products/ai-services/openai-service)** - Services Azure
- **[Moodle](https://moodle.org/)** - Intégration LMS

---

## 📈 Roadmap

### Version 1.1 (Q3 2025)
- **Nouveaux formats** : PowerPoint, Excel
- **IA avancée** : Génération d'images
- **Collaboration** : Révision collaborative
- **Analytics** : Tableau de bord avancé

### Version 1.2 (Q4 2025)
- **Multilingue** : Support anglais, espagnol
- **Accessibilité** : Conformité WCAG
- **Mobile** : Application mobile
- **Intégrations** : Teams, Slack, Discord

### Version 2.0 (Q1 2026)
- **IA générative** : Création de cours complets
- **Réalité augmentée** : Quiz interactifs
- **Blockchain** : Certification des compétences
- **Métaverse** : Environnements virtuels

---

## 🎉 Conclusion

**Éléa Quiz AI Generator** transforme la création de QCM en un processus simple, rapide et intelligent. Avec **Mistral AI**, vous bénéficiez d'une solution européenne, sécurisée et performante.

**Commencez dès maintenant :**
1. 📖 Lisez la [Documentation Complète](./DOCUMENTATION_COMPLETE.md)
2. 🚀 Suivez le [Guide d'Utilisation](./GUIDE_UTILISATION.md)
3. 🔧 Configurez avec le [Guide Mistral](./MISTRAL_INTEGRATION.md)
4. 💻 Testez avec vos propres documents

---

*Documentation mise à jour le 10 juillet 2025 - Version 1.0.0*

**Contributeurs :** Équipe Éléa Quiz AI Generator  
**Licence :** MIT  
**Support :** support@elea-quiz-ai.com
