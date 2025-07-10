#!/bin/bash

# Script pour créer des images de placeholder pour la documentation
# Utilise ImageMagick pour créer des images de démonstration

echo "🖼️  Création d'images de placeholder pour la documentation"
echo "======================================================="

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick n'est pas installé."
    echo "Installation recommandée:"
    echo "  - Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  - macOS: brew install imagemagick"
    echo "  - Windows: https://imagemagick.org/script/download.php"
    echo ""
    echo "Création d'images de placeholder alternatives..."
    
    # Créer des fichiers SVG de placeholder
    create_svg_placeholder() {
        local filename="$1"
        local width="$2"
        local height="$3"
        local title="$4"
        
        cat > "screenshots/$filename" << EOF
<svg width="$width" height="$height" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <rect x="20" y="20" width="$(($width-40))" height="$(($height-40))" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#374151">$title</text>
  <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Éléa Quiz Générateur</text>
  <text x="50%" y="75%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">Screenshot placeholder - ${width}x${height}</text>
</svg>
EOF
        echo "✅ Créé: screenshots/$filename"
    }
    
    # Créer des placeholders SVG
    create_svg_placeholder "01-home-screen.svg" 1920 1080 "Écran d'Accueil"
    create_svg_placeholder "04-mcq-editor.svg" 1920 1080 "Éditeur QCM"
    create_svg_placeholder "09-quiz-preview.svg" 1920 1080 "Aperçu Quiz"
    create_svg_placeholder "17-mobile-view.svg" 375 667 "Vue Mobile"
    
    echo ""
    echo "📝 Placeholders SVG créés. Remplacez-les par de vraies captures d'écran."
    
    return 0
fi

echo "✅ ImageMagick détecté"

# Créer le dossier screenshots s'il n'existe pas
mkdir -p screenshots

# Fonction pour créer une image de placeholder
create_placeholder() {
    local filename="$1"
    local width="$2"
    local height="$3"
    local title="$4"
    local subtitle="$5"
    
    echo "🖼️  Création: $filename ($width x $height)"
    
    convert -size ${width}x${height} xc:'#f3f4f6' \
        -fill '#e5e7eb' -draw "rectangle 20,20 $((width-20)),$((height-20))" \
        -stroke '#d1d5db' -strokewidth 2 -fill none -draw "rectangle 20,20 $((width-20)),$((height-20))" \
        -pointsize 32 -font Arial-Bold -fill '#1f2937' \
        -gravity center -annotate +0-40 "$title" \
        -pointsize 18 -font Arial -fill '#4b5563' \
        -gravity center -annotate +0+0 "Éléa Quiz Générateur" \
        -pointsize 14 -font Arial -fill '#6b7280' \
        -gravity center -annotate +0+30 "$subtitle" \
        -pointsize 12 -font Arial -fill '#9ca3af' \
        -gravity center -annotate +0+60 "Screenshot placeholder - ${width}x${height}" \
        "screenshots/$filename"
    
    if [ $? -eq 0 ]; then
        echo "✅ Créé: screenshots/$filename"
    else
        echo "❌ Erreur lors de la création: $filename"
    fi
}

echo ""
echo "🎨 Création des images de placeholder..."

# Images principales
create_placeholder "01-home-screen.png" 1920 1080 "Écran d'Accueil" "Interface moderne avec sidebar de navigation"
create_placeholder "02-quiz-creation.png" 1920 1080 "Création de Quiz" "Formulaire de création avec validation"
create_placeholder "03-questions-list.png" 1920 1080 "Liste des Questions" "Gestion avec recherche et filtres"
create_placeholder "04-mcq-editor.png" 1920 1080 "Éditeur QCM" "Édition intuitive avec aperçu temps réel"
create_placeholder "05-truefalse-editor.png" 1920 1080 "Éditeur Vrai/Faux" "Interface simplifiée pour questions binaires"
create_placeholder "06-matching-editor.png" 1920 1080 "Éditeur Appariement" "Gestion des associations par paires"
create_placeholder "07-question-preview.png" 1920 1080 "Aperçu Question" "Prévisualisation fidèle au rendu Moodle"
create_placeholder "08-quiz-preview.png" 1920 1080 "Aperçu Quiz" "Mode test complet avec simulation"
create_placeholder "09-export-panel.png" 1920 1080 "Panel d'Export" "Options d'export XML Moodle et CSV"
create_placeholder "10-import-panel.png" 1920 1080 "Panel d'Import" "Import de données avec validation"

# Versions responsive
create_placeholder "11-mobile-view.png" 375 667 "Vue Mobile" "Design responsive optimisé tactile"
create_placeholder "12-tablet-view.png" 1024 768 "Vue Tablette" "Interface adaptée tablette"

# Thèmes et fonctionnalités
create_placeholder "13-dark-theme.png" 1920 1080 "Thème Sombre" "Version sombre de l'interface"
create_placeholder "14-notifications.png" 1920 1080 "Notifications" "Système de messages contextuels"
create_placeholder "15-statistics.png" 1920 1080 "Statistiques" "Tableau de bord et métriques"

echo ""
echo "🎯 Images de placeholder créées avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Démarrez l'application: npm run dev"
echo "2. Créez du contenu de démonstration"
echo "3. Remplacez les placeholders par de vraies captures"
echo "4. Utilisez le script: ./take-screenshots.sh"
echo ""
echo "🔧 Outils recommandés:"
echo "   - Chrome DevTools pour les vues responsive"
echo "   - Extensions de capture d'écran"
echo "   - Script d'automatisation: node screenshot-automation.js"
echo ""
echo "📖 Documentation complète dans:"
echo "   - VISUAL_GUIDE.md (guide visuel détaillé)"
echo "   - screenshots/README.md (instructions techniques)"
