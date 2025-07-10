# 📸 Screenshots - Éléa Quiz Générateur

Ce dossier contient les captures d'écran de l'application pour la documentation.

## 📋 Liste des Captures d'Écran

### Interface Principale
- `01-home-screen.png` - Écran d'accueil avec sidebar et zone principale
- `02-quiz-creation.png` - Formulaire de création de quiz
- `03-questions-list.png` - Liste des questions avec recherche et filtres

### Éditeurs de Questions
- `04-mcq-editor.png` - Éditeur de questions QCM
- `05-truefalse-editor.png` - Éditeur de questions Vrai/Faux
- `06-matching-editor.png` - Éditeur de questions d'appariement
- `07-shortanswer-editor.png` - Éditeur de questions à réponse courte

### Aperçu et Test
- `08-question-preview.png` - Aperçu d'une question
- `09-quiz-preview.png` - Aperçu interactif du quiz complet
- `10-quiz-results.png` - Résultats du quiz test

### Import/Export
- `11-export-panel.png` - Panel d'export avec options
- `12-import-panel.png` - Panel d'import de données
- `13-xml-preview.png` - Aperçu du XML Moodle généré

### Gestion des Données
- `14-statistics.png` - Tableau de bord et statistiques
- `15-settings.png` - Paramètres et configuration
- `16-backup-restore.png` - Sauvegarde et restauration

### Design Responsive
- `17-mobile-view.png` - Version mobile
- `18-tablet-view.png` - Version tablette
- `19-desktop-view.png` - Version desktop complète

### Thèmes
- `20-dark-theme.png` - Thème sombre
- `21-high-contrast.png` - Thème haute contraste

### Fonctionnalités Avancées
- `22-drag-drop.png` - Réorganisation drag & drop
- `23-advanced-search.png` - Recherche avancée
- `24-real-time-validation.png` - Validation en temps réel
- `25-notifications.png` - Système de notifications

## 🎯 Instructions pour Prendre les Captures d'Écran

### 1. Préparation de l'Environnement

```bash
# Démarrer l'application
npm run dev

# Ouvrir dans le navigateur
open http://localhost:3000
```

### 2. Création du Contenu de Démonstration

Créer ce contenu avant de prendre les captures d'écran :

#### Quiz d'Exemple : "Quiz de Géographie"
- **Description** : "Testez vos connaissances en géographie mondiale"
- **Catégorie** : "Géographie"

#### Questions d'Exemple :

**Question QCM :**
- Type : QCM (choix unique)
- Titre : "Capitale de la France"
- Question : "Quelle est la capitale de la France ?"
- Réponses :
  - Paris (100%) ✓
  - Lyon (0%)
  - Marseille (0%)
  - Toulouse (0%)

**Question Vrai/Faux :**
- Type : Vrai/Faux
- Titre : "Mont Everest"
- Question : "Le Mont Everest est le plus haut sommet du monde."
- Réponse : Vrai ✓

**Question d'Appariement :**
- Type : Appariement
- Titre : "Capitales européennes"
- Question : "Associez chaque pays à sa capitale :"
- Pairs :
  - France → Paris
  - Italie → Rome
  - Espagne → Madrid
  - Allemagne → Berlin

**Question Réponse Courte :**
- Type : Réponse courte
- Titre : "Fleuve le plus long"
- Question : "Quel est le fleuve le plus long du monde ?"
- Réponses acceptées : "Nil", "Le Nil", "nil"

### 3. Paramètres de Capture

#### Résolutions Recommandées :
- **Desktop** : 1920x1080 (Full HD)
- **Tablette** : 1024x768 (iPad)
- **Mobile** : 375x667 (iPhone)

#### Outils Recommandés :
- **Chrome DevTools** : Pour les vues responsive
- **Lightshot** : Capture d'écran rapide
- **Snagit** : Édition avancée
- **Screenshot API** : Automatisation

### 4. Checklist de Qualité

Avant de sauvegarder chaque capture d'écran, vérifiez :

- [ ] **Contenu réaliste** : Données cohérentes et professionnelles
- [ ] **Interface propre** : Pas de barres de développement visibles
- [ ] **Résolution correcte** : Image nette et bien dimensionnée
- [ ] **Éléments visibles** : Tous les éléments importants sont affichés
- [ ] **États cohérents** : Interactions logiques (hover, focus, etc.)
- [ ] **Annotations** : Éléments importants mis en évidence si nécessaire

### 5. Scénarios Spécifiques

#### Capture de l'Écran d'Accueil :
1. Vider le localStorage pour un état initial
2. Afficher l'écran de bienvenue
3. Avoir quelques quiz exemple dans la sidebar

#### Capture des Éditeurs :
1. Ouvrir l'éditeur avec une question partiellement remplie
2. Montrer les validations en cours
3. Avoir l'aperçu visible à droite

#### Capture des États d'Erreur :
1. Remplir des données invalides
2. Déclencher les validations
3. Montrer les messages d'erreur clairs

#### Capture des Notifications :
1. Déclencher des actions (sauvegarder, exporter)
2. Capturer les notifications de succès/erreur
3. Montrer les différents types de notifications

### 6. Post-Traitement

#### Optimisation des Images :
```bash
# Installer les outils d'optimisation
npm install -g imagemin-cli imagemin-pngquant

# Optimiser toutes les images
imagemin screenshots/*.png --out-dir=screenshots/optimized --plugin=pngquant
```

#### Annotations (si nécessaire) :
- Utiliser des flèches pour pointer les éléments importants
- Ajouter des numéros pour les étapes
- Utiliser des couleurs consistantes (rouge pour les erreurs, vert pour les succès)

### 7. Validation Finale

Vérifier que chaque capture d'écran :
- [ ] Correspond à sa description dans VISUAL_GUIDE.md
- [ ] Est nommée selon la convention établie
- [ ] Affiche correctement sur différents appareils
- [ ] Représente fidèlement la fonctionnalité

## 📁 Structure des Fichiers

```
screenshots/
├── README.md                    # Ce fichier
├── 01-home-screen.png          # Écran d'accueil
├── 02-quiz-creation.png        # Création de quiz
├── ...                         # Autres captures
├── optimized/                  # Versions optimisées
│   ├── 01-home-screen.png
│   └── ...
└── raw/                        # Versions non traitées (optionnel)
    ├── 01-home-screen.png
    └── ...
```

## 🔧 Automatisation (Optionnel)

Pour automatiser la prise de captures d'écran :

```javascript
// screenshot-automation.js
const puppeteer = require('puppeteer');

async function takeScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Configurer la résolution
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Naviguer vers l'application
  await page.goto('http://localhost:3000');
  
  // Prendre les captures d'écran
  await page.screenshot({ path: 'screenshots/01-home-screen.png' });
  
  // ... autres captures
  
  await browser.close();
}

takeScreenshots();
```

---

**Note** : Les captures d'écran sont essentielles pour la documentation utilisateur. Prenez le temps de créer des images de qualité qui représentent fidèlement les fonctionnalités de l'application.
