# Script de Configuration pour les Captures d'Écran

## 🎯 Contenu de Démonstration Recommandé

### Quiz Principal : "Quiz de Géographie"
```json
{
  "name": "Quiz de Géographie",
  "description": "Testez vos connaissances en géographie mondiale",
  "category": "Géographie",
  "timeLimit": 30,
  "questions": [
    {
      "type": "mcq",
      "title": "Capitale de la France",
      "question": "Quelle est la capitale de la France ?",
      "answers": [
        { "text": "Paris", "correct": true, "feedback": "Correct ! Paris est bien la capitale de la France." },
        { "text": "Lyon", "correct": false, "feedback": "Incorrect. Lyon est la troisième ville de France." },
        { "text": "Marseille", "correct": false, "feedback": "Incorrect. Marseille est la deuxième ville de France." },
        { "text": "Toulouse", "correct": false, "feedback": "Incorrect. Toulouse est la quatrième ville de France." }
      ]
    },
    {
      "type": "mcq",
      "title": "Capitale de l'Italie",
      "question": "Quelle est la capitale de l'Italie ?",
      "answers": [
        { "text": "Rome", "correct": true, "feedback": "Correct ! Rome est la capitale de l'Italie." },
        { "text": "Milan", "correct": false, "feedback": "Incorrect. Milan est la capitale économique." },
        { "text": "Naples", "correct": false, "feedback": "Incorrect. Naples est dans le sud de l'Italie." },
        { "text": "Florence", "correct": false, "feedback": "Incorrect. Florence est en Toscane." }
      ]
    },
    {
      "type": "truefalse",
      "title": "Mont Everest",
      "question": "Le Mont Everest est le plus haut sommet du monde.",
      "correctAnswer": true,
      "trueFeedback": "Correct ! Le Mont Everest culmine à 8 848 mètres.",
      "falseFeedback": "Incorrect. Le Mont Everest est bien le plus haut sommet du monde."
    },
    {
      "type": "matching",
      "title": "Capitales européennes",
      "question": "Associez chaque pays à sa capitale :",
      "pairs": [
        { "left": "France", "right": "Paris" },
        { "left": "Italie", "right": "Rome" },
        { "left": "Espagne", "right": "Madrid" },
        { "left": "Allemagne", "right": "Berlin" }
      ]
    },
    {
      "type": "shortanswer",
      "title": "Fleuve le plus long",
      "question": "Quel est le fleuve le plus long du monde ?",
      "answers": [
        { "text": "Nil", "correct": true },
        { "text": "Le Nil", "correct": true },
        { "text": "nil", "correct": true }
      ]
    }
  ]
}
```

### Quiz Secondaire : "Quiz de Sciences"
```json
{
  "name": "Quiz de Sciences",
  "description": "Connaissances générales en sciences",
  "category": "Sciences",
  "timeLimit": 20,
  "questions": [
    {
      "type": "mcq",
      "title": "Planète la plus proche du Soleil",
      "question": "Quelle est la planète la plus proche du Soleil ?",
      "answers": [
        { "text": "Mercure", "correct": true },
        { "text": "Vénus", "correct": false },
        { "text": "Terre", "correct": false },
        { "text": "Mars", "correct": false }
      ]
    },
    {
      "type": "truefalse",
      "title": "Vitesse de la lumière",
      "question": "La vitesse de la lumière est de 300 000 km/s.",
      "correctAnswer": true
    }
  ]
}
```

## 🎨 Paramètres de Capture d'Écran

### Résolutions Standard
- **Desktop** : 1920x1080 (Full HD)
- **Tablette** : 1024x768 (iPad standard)
- **Mobile** : 375x667 (iPhone 8/SE)

### Couleurs et Thèmes
- **Thème clair** : Couleurs par défaut
- **Thème sombre** : Ajouter la classe `dark` à `<html>`
- **Haute contraste** : Modifier les variables CSS

## 📋 Checklist de Qualité

### Avant chaque capture :
- [ ] Contenu réaliste et cohérent
- [ ] Pas de données personnelles
- [ ] Interface propre (pas de console ouverte)
- [ ] Résolution correcte
- [ ] Éléments importants visibles
- [ ] États logiques (hover, focus, etc.)

### Après chaque capture :
- [ ] Fichier correctement nommé
- [ ] Taille de fichier optimisée
- [ ] Qualité d'image acceptable
- [ ] Correspondance avec la description
- [ ] Pas d'éléments coupés

## 🔧 Outils et Extensions

### Extensions Chrome Recommandées :
1. **Lightshot** - Capture rapide avec annotation
2. **Full Page Screen Capture** - Capture de page complète
3. **Nimbus Screenshot** - Capture avec édition
4. **GoFullPage** - Capture de page entière

### Outils Système :
- **macOS** : `Cmd + Shift + 4` (zone) ou `Cmd + Shift + 5` (options)
- **Windows** : `Win + Shift + S` (Snipping Tool)
- **Linux** : `gnome-screenshot` ou `flameshot`

### Éditeurs d'Images :
- **Gratuits** : GIMP, Paint.NET, Photopea
- **Payants** : Adobe Photoshop, Sketch, Figma
- **En ligne** : Canva, Pixlr, Photopea

## 🎯 Scénarios de Capture

### 1. Écran d'Accueil
- Vider le localStorage
- Afficher l'écran de bienvenue
- Avoir 2-3 quiz dans la sidebar

### 2. Création de Quiz
- Ouvrir le formulaire de création
- Remplir partiellement les champs
- Montrer la validation en temps réel

### 3. Éditeur de Questions
- Ouvrir l'éditeur QCM
- Remplir une question complète
- Afficher l'aperçu à droite
- Montrer les validations

### 4. Aperçu de Quiz
- Charger un quiz complet
- Montrer le mode test
- Afficher la progression
- Inclure le timer

### 5. Panels Import/Export
- Ouvrir les panels
- Montrer les options disponibles
- Inclure des données d'exemple
- Afficher les validations

## 🚀 Automatisation

### Script Node.js avec Puppeteer :
```javascript
const puppeteer = require('puppeteer');

async function captureScreenshot(url, filename, viewport) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(url);
  await page.screenshot({ path: `screenshots/${filename}` });
  await browser.close();
}
```

### Script Bash avec Chrome Headless :
```bash
google-chrome --headless --disable-gpu --window-size=1920,1080 \
  --screenshot=screenshots/screenshot.png \
  http://localhost:3000
```

## 📊 Métadonnées des Images

### Informations à inclure :
- **Nom du fichier** : Convention numérotée
- **Dimensions** : Largeur x Hauteur
- **Taille du fichier** : Optimisée < 500KB
- **Format** : PNG ou JPG selon le contenu
- **Description** : Texte alternatif pour l'accessibilité
- **Contexte** : Fonctionnalité illustrée

### Exemple de métadonnées :
```yaml
01-home-screen.png:
  dimensions: 1920x1080
  size: 245KB
  format: PNG
  description: "Écran d'accueil avec sidebar de navigation"
  context: "Interface principale de l'application"
  features: ["navigation", "accueil", "sidebar"]
```

## 🌐 Optimisation Web

### Formats d'Images :
- **PNG** : Interfaces avec transparence
- **JPG** : Photos et images complexes
- **WebP** : Format moderne optimisé
- **SVG** : Illustrations vectorielles

### Optimisation :
```bash
# Optimisation PNG
pngquant --quality=65-80 --output optimized.png original.png

# Optimisation JPG
jpegoptim --max=80 --strip-all image.jpg

# Conversion WebP
cwebp -q 80 image.png -o image.webp
```

---

**Note** : Cette configuration garantit des captures d'écran cohérentes et de qualité pour la documentation de l'application.
