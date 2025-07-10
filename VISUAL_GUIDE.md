# 📸 Guide Visuel - Éléa Quiz Générateur

Ce guide présente les principales fonctionnalités de l'application avec des captures d'écran détaillées.

## 🏠 Interface Principale

### 1. Écran d'Accueil
*Capture d'écran : `screenshots/01-home-screen.png`*

L'écran d'accueil présente une interface propre et moderne avec :
- **Sidebar gauche** : Navigation principale avec les actions essentielles
- **Zone centrale** : Affichage du contenu principal (écran de bienvenue, éditeur, aperçu)
- **Header** : Informations sur le quiz actuel et actions rapides
- **Design responsive** : S'adapte automatiquement aux différentes tailles d'écran

**Éléments visibles :**
- Bouton "Nouveau Quiz" pour créer un nouveau quiz
- Liste des quiz existants avec dates de création
- Statistiques rapides (nombre de questions, dernière modification)
- Boutons d'import/export facilement accessibles

### 2. Création d'un Nouveau Quiz
*Capture d'écran : `screenshots/02-quiz-creation.png`*

Formulaire de création de quiz avec :
- **Champ nom** : Nom du quiz (requis)
- **Description** : Description optionnelle du quiz
- **Catégorie** : Sélection de la catégorie Moodle
- **Paramètres avancés** : Configuration des options du quiz
- **Validation temps réel** : Vérification des données saisies

**Fonctionnalités :**
- Validation instantanée des champs
- Suggestions automatiques pour les catégories
- Paramètres par défaut intelligents
- Bouton "Créer" activé uniquement quand les données sont valides

## 📝 Gestion des Questions

### 3. Liste des Questions
*Capture d'écran : `screenshots/03-questions-list.png`*

Vue d'ensemble des questions avec :
- **Barre de recherche** : Recherche en temps réel dans le contenu
- **Filtres** : Filtrage par type de question (QCM, Vrai/Faux, etc.)
- **Tri** : Tri par nom, type, date de création
- **Actions rapides** : Édition, duplication, suppression
- **Aperçu** : Prévisualisation rapide du contenu

**Fonctionnalités avancées :**
- Sélection multiple pour les actions en lot
- Drag & drop pour réorganiser les questions
- Compteur de questions par type
- Indicateurs visuels pour l'état des questions

### 4. Éditeur de Questions QCM
*Capture d'écran : `screenshots/04-mcq-editor.png`*

Interface d'édition complète pour les QCM :
- **Titre de la question** : Champ de titre avec compteur de caractères
- **Énoncé** : Éditeur de texte riche pour la question
- **Type de réponse** : Choix unique ou multiple
- **Réponses** : Gestion des options avec pourcentages
- **Feedbacks** : Commentaires personnalisés pour chaque réponse
- **Aperçu en temps réel** : Visualisation instantanée

**Éléments visuels :**
- Icônes différentes pour choix unique/multiple
- Indicateurs de pourcentage avec barres colorées
- Boutons d'ajout/suppression de réponses
- Validation visuelle des données requises

### 5. Éditeur de Questions Vrai/Faux
*Capture d'écran : `screenshots/05-truefalse-editor.png`*

Interface simplifiée pour les questions Vrai/Faux :
- **Énoncé de la question** : Texte principal
- **Réponse correcte** : Sélection Vrai/Faux
- **Feedbacks spécifiques** : Commentaires pour chaque réponse
- **Paramètres avancés** : Note et pénalité
- **Aperçu intégré** : Visualisation en temps réel

### 6. Éditeur de Questions d'Appariement
*Capture d'écran : `screenshots/06-matching-editor.png`*

Interface pour les questions d'appariement :
- **Pairs question/réponse** : Gestion des associations
- **Ajout dynamique** : Boutons pour ajouter/supprimer des pairs
- **Validation** : Vérification des associations complètes
- **Aperçu des associations** : Visualisation des correspondances

## 🎯 Aperçu et Test

### 7. Aperçu d'une Question
*Capture d'écran : `screenshots/07-question-preview.png`*

Prévisualisation fidèle au rendu Moodle :
- **Rendu exact** : Affichage identique à Moodle
- **Interactions** : Test des réponses en temps réel
- **Feedbacks** : Affichage des commentaires
- **Navigation** : Boutons précédent/suivant

### 8. Aperçu Interactif du Quiz
*Capture d'écran : `screenshots/08-quiz-preview.png`*

Mode test complet du quiz :
- **Interface de test** : Simulation de l'examen
- **Timer** : Gestion du temps (si configuré)
- **Progression** : Barre de progression des questions
- **Résultats** : Affichage des scores et feedbacks
- **Navigation** : Retour aux questions, révision

## 📤 Import/Export

### 9. Panel d'Export
*Capture d'écran : `screenshots/09-export-panel.png`*

Interface d'export avec options :
- **Format de sortie** : XML Moodle, CSV, JSON
- **Options d'export** : Inclusion des images, feedbacks
- **Catégorie Moodle** : Sélection de la catégorie de destination
- **Aperçu** : Prévisualisation du fichier généré
- **Téléchargement** : Génération et téléchargement du fichier

**Fonctionnalités :**
- Validation avant export
- Génération de fichiers conformes Moodle
- Options de personnalisation avancées
- Historique des exports

### 10. Panel d'Import
*Capture d'écran : `screenshots/10-import-panel.png`*

Interface d'import de données :
- **Sélection de fichier** : Drag & drop ou sélection
- **Format détecté** : Reconnaissance automatique du format
- **Aperçu des données** : Prévisualisation avant import
- **Validation** : Vérification des erreurs
- **Mapping** : Correspondance des colonnes
- **Résumé** : Statistiques d'import

## 📊 Gestion des Données

### 11. Statistiques et Analyse
*Capture d'écran : `screenshots/11-statistics.png`*

Tableau de bord avec métriques :
- **Nombres de questions** : Répartition par type
- **Graphiques** : Visualisation des données
- **Tendances** : Évolution dans le temps
- **Qualité** : Indicateurs de complétude
- **Performance** : Métriques d'utilisation

### 12. Paramètres et Configuration
*Capture d'écran : `screenshots/12-settings.png`*

Interface de configuration :
- **Paramètres généraux** : Langue, thème
- **Paramètres d'export** : Formats par défaut
- **Sauvegarde** : Gestion des données locales
- **Notifications** : Configuration des alertes
- **Avancé** : Options développeur

## 📱 Design Responsive

### 13. Version Mobile
*Capture d'écran : `screenshots/13-mobile-view.png`*

Adaptation mobile optimisée :
- **Navigation adaptée** : Menu burger pour la sidebar
- **Interfaces compactes** : Formulaires optimisés tactile
- **Gestes** : Swipe et touch pour la navigation
- **Performance** : Chargement optimisé mobile

### 14. Version Tablette
*Capture d'écran : `screenshots/14-tablet-view.png`*

Interface tablette :
- **Disposition hybride** : Mélange desktop/mobile
- **Sidebar adaptative** : Rétractable selon l'orientation
- **Zones de saisie** : Optimisées pour le tactile
- **Multi-colonnes** : Utilisation optimale de l'espace

## 🎨 Thèmes et Personnalisation

### 15. Thème Sombre
*Capture d'écran : `screenshots/15-dark-theme.png`*

Version sombre de l'interface :
- **Couleurs inversées** : Palette sombre élégante
- **Contraste préservé** : Lisibilité maintenue
- **Icônes adaptées** : Ajustement des couleurs
- **Confort visuel** : Réduction de la fatigue oculaire

### 16. Thème Haute Contraste
*Capture d'écran : `screenshots/16-high-contrast.png`*

Mode accessibilité :
- **Contraste élevé** : Amélioration de la lisibilité
- **Couleurs dédiées** : Palette optimisée accessibilité
- **Bordures renforcées** : Délimitation claire des éléments
- **Compatibilité** : Support des lecteurs d'écran

## ⚡ Fonctionnalités Avancées

### 17. Éditeur Drag & Drop
*Capture d'écran : `screenshots/17-drag-drop.png`*

Réorganisation intuitive :
- **Poignées de déplacement** : Icônes de glissement
- **Zones de dépôt** : Indicateurs visuels
- **Feedback visuel** : Animation pendant le déplacement
- **Sauvegarde automatique** : Ordre préservé

### 18. Recherche Avancée
*Capture d'écran : `screenshots/18-advanced-search.png`*

Système de recherche puissant :
- **Recherche textuelle** : Dans tous les champs
- **Filtres combinés** : Critères multiples
- **Suggestions** : Autocomplétion intelligente
- **Résultats surlignés** : Mise en évidence des termes

### 19. Validation en Temps Réel
*Capture d'écran : `screenshots/19-real-time-validation.png`*

Vérification instantanée :
- **Indicateurs visuels** : Couleurs pour les erreurs/succès
- **Messages contextuels** : Explications des erreurs
- **Corrections suggérées** : Aide à la résolution
- **Blocage intelligent** : Prévention des erreurs

### 20. Notifications et Alertes
*Capture d'écran : `screenshots/20-notifications.png`*

Système de notifications :
- **Alertes contextuelles** : Messages adaptés aux actions
- **Types variés** : Succès, erreurs, avertissements, infos
- **Persistance configurable** : Durée d'affichage
- **Actions rapides** : Boutons d'action dans les notifications

## 🔧 Outils de Développement

### 21. Console de Debug
*Capture d'écran : `screenshots/21-debug-console.png`*

Outils de développement :
- **Logs structurés** : Informations détaillées
- **États React** : Inspection des composants
- **Performance** : Métriques de rendu
- **Erreurs** : Debugging facilité

---

## 📋 Instructions pour les Captures d'Écran

### Comment prendre les captures d'écran :

1. **Ouvrir l'application** : `npm run dev`
2. **Naviguer vers** : `http://localhost:3000`
3. **Créer du contenu** : Ajouter des quiz et questions exemples
4. **Capturer les écrans** : Utiliser les outils de capture d'écran
5. **Nommer les fichiers** : Suivre la convention `XX-description.png`
6. **Résolution** : 1920x1080 pour desktop, 375x667 pour mobile
7. **Format** : PNG avec compression optimisée

### Contenu recommandé pour les captures :

- **Quiz d'exemple** : "Quiz de Géographie" avec 5-6 questions
- **Questions variées** : Un de chaque type (QCM, Vrai/Faux, etc.)
- **Données réalistes** : Contenu éducatif cohérent
- **États différents** : Erreurs, succès, chargement
- **Interactions** : Boutons survolés, menus ouverts

### Optimisation des images :

```bash
# Installer les outils d'optimisation
npm install -g imagemin-cli imagemin-pngquant

# Optimiser les images
imagemin screenshots/*.png --out-dir=screenshots/optimized --plugin=pngquant
```

Cette documentation visuelle complète permettra aux utilisateurs de comprendre rapidement les fonctionnalités de l'application et aux développeurs de maintenir une cohérence visuelle.
