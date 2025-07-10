#!/bin/bash

# Script pour prendre des captures d'écran de l'application
# Utilise Chrome en mode headless pour automatiser la capture

echo "📸 Script de Capture d'Écran - Éléa Quiz Générateur"
echo "================================================="

# Vérifier si l'application est en cours d'exécution
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ L'application n'est pas accessible sur http://localhost:3000"
    echo "Démarrez l'application avec : npm run dev"
    exit 1
fi

echo "✅ Application détectée sur http://localhost:3000"

# Créer le dossier screenshots s'il n'existe pas
mkdir -p screenshots

# Fonction pour prendre une capture d'écran
take_screenshot() {
    local url="$1"
    local filename="$2"
    local width="${3:-1920}"
    local height="${4:-1080}"
    
    echo "📸 Capture: $filename ($width x $height)"
    
    # Utiliser Chrome en mode headless
    google-chrome \
        --headless \
        --disable-gpu \
        --virtual-time-budget=2000 \
        --window-size=$width,$height \
        --screenshot="screenshots/$filename" \
        "$url" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Sauvegardé: screenshots/$filename"
    else
        echo "❌ Erreur lors de la capture: $filename"
    fi
}

echo ""
echo "🎯 Prise de captures d'écran..."

# Captures d'écran principales
take_screenshot "http://localhost:3000" "01-home-screen.png"
take_screenshot "http://localhost:3000" "02-desktop-view.png"

# Captures responsive
take_screenshot "http://localhost:3000" "03-tablet-view.png" 1024 768
take_screenshot "http://localhost:3000" "04-mobile-view.png" 375 667

echo ""
echo "📋 Instructions pour compléter la documentation visuelle:"
echo ""
echo "1. Ouvrez l'application dans votre navigateur: http://localhost:3000"
echo "2. Créez du contenu de démonstration:"
echo "   - Quiz: 'Quiz de Géographie'"
echo "   - Questions: QCM, Vrai/Faux, Appariement, Réponse courte"
echo "3. Naviguez dans les différentes sections et prenez des captures:"
echo ""

# Liste des captures d'écran recommandées
screenshots=(
    "05-quiz-creation.png|Formulaire de création de quiz"
    "06-questions-list.png|Liste des questions avec recherche"
    "07-mcq-editor.png|Éditeur de questions QCM"
    "08-truefalse-editor.png|Éditeur de questions Vrai/Faux"
    "09-matching-editor.png|Éditeur de questions d'appariement"
    "10-shortanswer-editor.png|Éditeur de questions à réponse courte"
    "11-question-preview.png|Aperçu d'une question"
    "12-quiz-preview.png|Aperçu interactif du quiz"
    "13-export-panel.png|Panel d'export avec options"
    "14-import-panel.png|Panel d'import de données"
    "15-statistics.png|Statistiques et tableau de bord"
    "16-settings.png|Paramètres et configuration"
    "17-dark-theme.png|Thème sombre"
    "18-notifications.png|Système de notifications"
    "19-drag-drop.png|Réorganisation drag & drop"
    "20-advanced-search.png|Recherche avancée"
)

echo "📸 Captures d'écran recommandées:"
for item in "${screenshots[@]}"; do
    filename=$(echo "$item" | cut -d'|' -f1)
    description=$(echo "$item" | cut -d'|' -f2)
    echo "   - $filename : $description"
done

echo ""
echo "🔧 Outils recommandés pour la capture manuelle:"
echo "   - Chrome DevTools (F12) -> Device Toolbar pour les vues mobile/tablette"
echo "   - Lightshot (extension Chrome) pour captures rapides"
echo "   - macOS: Cmd+Shift+4 pour capturer une zone"
echo "   - Windows: Outil Capture d'écran ou Snipping Tool"
echo "   - Linux: Gnome Screenshot ou Flameshot"

echo ""
echo "📐 Paramètres recommandés:"
echo "   - Résolution Desktop: 1920x1080"
echo "   - Résolution Tablette: 1024x768"
echo "   - Résolution Mobile: 375x667"
echo "   - Format: PNG"
echo "   - Qualité: Haute résolution"

echo ""
echo "✅ Captures d'écran de base créées!"
echo "📋 Consultez VISUAL_GUIDE.md pour plus de détails"
echo "🔗 Consultez screenshots/README.md pour les instructions complètes"
