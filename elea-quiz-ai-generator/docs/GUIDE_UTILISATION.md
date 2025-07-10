# 🎯 Guide d'Utilisation - Éléa Quiz AI Generator

## 📋 Table des Matières
1. [Démarrage Rapide](#-démarrage-rapide)
2. [Interface Web](#-interface-web)
3. [CLI Mistral](#-cli-mistral)
4. [Exemples Pratiques](#-exemples-pratiques)
5. [Intégration Éléa](#-intégration-éléa)
6. [Troubleshooting](#-troubleshooting)

---

## 🚀 Démarrage Rapide

### Installation en 3 étapes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-org/elea-quiz-ai-generator.git
cd elea-quiz-ai-generator

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés API
```

### Configuration Minimale

```env
# .env
MISTRAL_API_KEY=your-mistral-api-key-here
MISTRAL_MODEL=mistral-large-latest
NODE_ENV=development
PORT=3000
```

### Première Génération

```bash
# Démarrer l'interface web
npm run dev

# Ou utiliser le CLI directement
npm run mistral:generate -- --input test-document.txt --count 10
```

---

## 🖥️ Interface Web

### 1. Page d'Accueil
![Page d'accueil](./screenshots/home-page.png)

**Fonctionnalités :**
- **Dashboard** : Vue d'ensemble des générations
- **Accès rapide** : Boutons vers les fonctions principales
- **Historique** : Dernières générations
- **Statut** : État des services IA

### 2. Upload de Fichiers
![Upload de fichiers](./screenshots/file-upload.png)

**Étapes :**
1. **Glisser-déposer** votre fichier PDF/DOCX
2. **Prévisualiser** le contenu extrait
3. **Valider** la qualité de l'extraction
4. **Passer** à l'étape suivante

**Formats supportés :**
- PDF (jusqu'à 50MB)
- DOCX (Microsoft Word)
- TXT (texte brut)
- HTML (contenu web)

### 3. Configuration IA
![Configuration IA](./screenshots/ai-config.png)

**Paramètres Mistral :**
- **Modèle** : `mistral-large-latest` (recommandé)
- **Température** : 0.7 (équilibre créativité/précision)
- **Tokens max** : 2000 (longueur réponse)
- **Mode sécurisé** : Activé (filtrage contenu)

### 4. Génération de Quiz
![Génération de quiz](./screenshots/quiz-generation.png)

**Configuration :**
- **Nombre** : 10-25 questions recommandées
- **Type** : Mixed (variété de questions)
- **Niveau** : Selon votre public
- **Domaine** : Catégorie pédagogique

### 5. Révision des Questions
![Révision des questions](./screenshots/question-review.png)

**Actions disponibles :**
- ✏️ **Éditer** : Modifier questions/réponses
- 🔄 **Regénérer** : Nouvelle version IA
- ⭐ **Noter** : Évaluer la qualité
- 📊 **Analyser** : Statistiques détaillées

### 6. Intégration Éléa
![Intégration Éléa](./screenshots/elea-integration.png)

**Déploiement :**
- **Cours cible** : Sélection dans Éléa
- **Format** : XML Moodle, GIFT, JSON
- **Options** : Publication automatique
- **Notifications** : Confirmation déploiement

---

## 💻 CLI Mistral

### Vue d'ensemble
![CLI Mistral](./screenshots/mistral-cli.png)

Le CLI Mistral offre une interface en ligne de commande complète pour l'automatisation.

### Commandes Principales

#### 1. Génération de Quiz
```bash
# Génération simple
npm run mistral:generate -- --input cours.pdf --count 20

# Génération avancée
npm run mistral:generate -- \
  --input "Cours de Mathématiques.pdf" \
  --count 25 \
  --type mixed \
  --level advanced \
  --model mistral-large-latest \
  --safe-prompt \
  --output quiz-maths.json \
  --format moodle
```

#### 2. Gestion des Modèles
```bash
# Lister les modèles disponibles
npm run mistral:models

# Sortie attendue:
# 🤖 Modèles Mistral disponibles:
# ✅ mistral-large-latest (Recommandé)
# ✅ mistral-medium-latest
# ✅ mistral-small-latest
# ✅ mistral-tiny
```

#### 3. Configuration
```bash
# Créer une configuration
npm run mistral:init

# Crée: mistral-config.json
{
  "provider": "mistral",
  "apiKey": "YOUR_MISTRAL_API_KEY",
  "model": "mistral-large-latest",
  "temperature": 0.7,
  "maxTokens": 2000,
  "safePrompt": true
}
```

### Options CLI Détaillées

| Option | Raccourci | Description | Exemple |
|--------|-----------|-------------|---------|
| `--input` | `-i` | Fichier source | `-i cours.pdf` |
| `--count` | `-c` | Nombre de questions | `-c 15` |
| `--type` | `-t` | Type de questions | `-t mcq` |
| `--level` | `-l` | Niveau difficulté | `-l intermediate` |
| `--model` | `-m` | Modèle Mistral | `-m mistral-large-latest` |
| `--output` | `-o` | Fichier sortie | `-o quiz.json` |
| `--format` | `-f` | Format export | `-f moodle` |
| `--safe-prompt` | - | Mode sécurisé | `--safe-prompt` |
| `--temperature` | - | Créativité (0-1) | `--temperature 0.5` |
| `--max-tokens` | - | Tokens max | `--max-tokens 1500` |

---

## 📚 Exemples Pratiques

### Exemple 1: Cours de Sciences
```bash
# Document: "Biologie Cellulaire - Chapitre 3.pdf"
npm run mistral:generate -- \
  --input "Biologie Cellulaire - Chapitre 3.pdf" \
  --count 20 \
  --type mixed \
  --level intermediate \
  --model mistral-large-latest \
  --safe-prompt \
  --output quiz-biologie-ch3.json

# Résultat: 20 questions mixtes (QCM, Vrai/Faux, etc.)
# Format: JSON avec métadonnées complètes
```

### Exemple 2: Formation Professionnelle
```bash
# Document: "Guide Sécurité Informatique.docx"
npm run mistral:generate -- \
  --input "Guide Sécurité Informatique.docx" \
  --count 30 \
  --type mcq \
  --level advanced \
  --model mistral-large-latest \
  --format moodle \
  --output quiz-securite-pro.xml

# Résultat: 30 QCM niveau avancé
# Format: XML Moodle prêt à importer
```

### Exemple 3: Traitement par Lots
```bash
# Traiter plusieurs documents
for file in cours/*.pdf; do
  npm run mistral:generate -- \
    --input "$file" \
    --count 15 \
    --type mixed \
    --level intermediate \
    --output "quiz-$(basename "$file" .pdf).json"
done

# Résultat: Un quiz par document PDF
```

### Exemple 4: Configuration Personnalisée
```bash
# Créer une configuration spécifique
cat > mistral-config-lycee.json << EOF
{
  "provider": "mistral",
  "apiKey": "$MISTRAL_API_KEY",
  "model": "mistral-medium-latest",
  "temperature": 0.6,
  "maxTokens": 1800,
  "safePrompt": true,
  "defaults": {
    "questionCount": 12,
    "questionType": "mixed",
    "difficulty": "intermediate",
    "language": "fr"
  }
}
EOF

# Utiliser la configuration
npm run mistral:generate -- \
  --config mistral-config-lycee.json \
  --input "Cours Histoire.pdf"
```

---

## 🎓 Intégration Éléa

### Configuration Éléa
```json
{
  "elea": {
    "apiUrl": "https://elea.ac-toulouse.fr/api",
    "apiKey": "your-elea-api-key",
    "webhookSecret": "your-webhook-secret",
    "defaults": {
      "courseId": 123,
      "categoryId": 456,
      "autoPublish": false,
      "notifications": true
    }
  }
}
```

### Déploiement Automatique
```bash
# Génération + déploiement direct
npm run mistral:generate -- \
  --input cours.pdf \
  --count 20 \
  --deploy-elea \
  --course-id 123 \
  --category-id 456

# Ou via l'interface web
# 1. Générer le quiz
# 2. Cliquer "Déployer dans Éléa"
# 3. Sélectionner cours et catégorie
# 4. Confirmer le déploiement
```

### Formats d'Export Éléa

#### XML Moodle
```xml
<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <question type="multichoice">
    <name><text>Question 1</text></name>
    <questiontext><text>Quelle est la capitale de la France ?</text></questiontext>
    <answer fraction="100"><text>Paris</text></answer>
    <answer fraction="0"><text>Lyon</text></answer>
    <answer fraction="0"><text>Marseille</text></answer>
    <answer fraction="0"><text>Toulouse</text></answer>
  </question>
</quiz>
```

#### Format GIFT
```gift
// Question 1
Quelle est la capitale de la France ? {
  =Paris
  ~Lyon
  ~Marseille
  ~Toulouse
}

// Question 2
La France est-elle en Europe ? {TRUE}
```

---

## 🔧 Troubleshooting

### Erreurs Communes

#### 1. Clé API Manquante
```bash
❌ Erreur: Clé API Mistral manquante
✅ Solution: Définir MISTRAL_API_KEY dans .env
```

#### 2. Fichier Non Trouvé
```bash
❌ Erreur: Fichier 'cours.pdf' non trouvé
✅ Solution: Vérifier le chemin absolu ou relatif
```

#### 3. Modèle Non Supporté
```bash
❌ Erreur: Modèle 'gpt-4' non supporté par Mistral
✅ Solution: Utiliser npm run mistral:models
```

#### 4. Quota API Dépassé
```bash
❌ Erreur: Quota API dépassé
✅ Solution: Vérifier votre compte Mistral
```

### Debug Mode
```bash
# Activer les logs détaillés
DEBUG=true npm run mistral:generate -- --input cours.pdf

# Vérifier la configuration
npm run mistral:config -- --validate

# Tester la connexion API
npm run mistral:test -- --api-key your-key
```

### Logs et Monitoring
```bash
# Voir les logs en temps réel
tail -f logs/mistral.log

# Statistiques d'utilisation
npm run mistral:stats

# Nettoyer les fichiers temporaires
npm run mistral:clean
```

---

## 📊 Optimisation des Performances

### Modèles Recommandés par Usage

| Usage | Modèle | Coût | Performance |
|-------|--------|------|-------------|
| **Production** | mistral-large-latest | €€€ | ⭐⭐⭐⭐⭐ |
| **Développement** | mistral-medium-latest | €€ | ⭐⭐⭐⭐ |
| **Tests** | mistral-small-latest | € | ⭐⭐⭐ |
| **Prototypage** | mistral-tiny | € | ⭐⭐ |

### Optimisation des Coûts
```bash
# Utiliser le modèle approprié
--model mistral-medium-latest  # Pour la plupart des cas

# Limiter les tokens
--max-tokens 1500  # Réduire si possible

# Optimiser le prompt
--temperature 0.5  # Moins de variabilité = moins de tokens
```

---

## 🎯 Bonnes Pratiques

### 1. Préparation des Documents
- **Qualité** : Documents bien structurés
- **Taille** : Moins de 50MB pour les PDF
- **Format** : Préférer PDF natif vs scanné
- **Langue** : Français pour Mistral

### 2. Configuration Optimale
```json
{
  "model": "mistral-large-latest",
  "temperature": 0.7,
  "maxTokens": 2000,
  "safePrompt": true,
  "questionCount": 15,
  "questionType": "mixed"
}
```

### 3. Révision Systématique
- **Vérifier** : Exactitude des réponses
- **Adapter** : Niveau au public cible
- **Équilibrer** : Types de questions
- **Tester** : Avec un échantillon d'étudiants

### 4. Intégration Éléa
- **Tester** : En mode brouillon d'abord
- **Catégoriser** : Organiser par matière
- **Notifier** : Informer les enseignants
- **Sauvegarder** : Garder les originaux

---

## 🆘 Support

### Documentation
- 📖 [Documentation complète](./DOCUMENTATION_COMPLETE.md)
- 🔧 [Guide d'intégration](./MISTRAL_INTEGRATION.md)
- 📊 [API Reference](./API.md)

### Communauté
- 💬 **Discord** : [Rejoindre la communauté](https://discord.gg/elea-quiz-ai)
- 📧 **Email** : support@elea-quiz-ai.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-org/elea-quiz-ai-generator/issues)

---

*Guide d'utilisation - Version 1.0.0 - Dernière mise à jour: 10 juillet 2025*
