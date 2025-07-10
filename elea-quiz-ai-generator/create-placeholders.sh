#!/bin/bash

# Script pour créer des images placeholder pour la documentation
# Utilise ImageMagick pour créer des images de démonstration

echo "🎨 Création des images placeholder..."

# Créer le dossier screenshots s'il n'existe pas
mkdir -p docs/screenshots

# Fonction pour créer une image placeholder
create_placeholder() {
    local filename=$1
    local title=$2
    local description=$3
    local width=${4:-1920}
    local height=${5:-1080}
    
    echo "🖼️  Création: $title"
    
    # Vérifier si ImageMagick est installé
    if command -v convert &>/dev/null; then
        convert -size ${width}x${height} xc:white \
            -fill '#0f172a' -pointsize 48 -gravity north -annotate +0+100 "$title" \
            -fill '#64748b' -pointsize 24 -gravity center -annotate +0+0 "$description" \
            -fill '#e2e8f0' -draw "rectangle 50,50 $((width-50)),$((height-50))" \
            -fill '#3b82f6' -draw "rectangle 100,200 $((width-100)),300" \
            -fill '#10b981' -draw "rectangle 100,350 $((width-100)),450" \
            -fill '#f59e0b' -draw "rectangle 100,500 $((width-100)),600" \
            "docs/screenshots/$filename"
    else
        # Fallback: créer un fichier SVG
        cat > "docs/screenshots/$filename" << EOF
<svg width="$width" height="$height" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <rect x="50" y="50" width="$((width-100))" height="$((height-100))" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
  <text x="50%" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="#0f172a">$title</text>
  <text x="50%" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#64748b">$description</text>
  <rect x="100" y="250" width="$((width-200))" height="100" fill="#3b82f6"/>
  <rect x="100" y="400" width="$((width-200))" height="100" fill="#10b981"/>
  <rect x="100" y="550" width="$((width-200))" height="100" fill="#f59e0b"/>
</svg>
EOF
    fi
}

# Créer les images placeholder
create_placeholder "home-page.png" "Éléa Quiz AI Generator" "Interface principale avec upload de fichiers et configuration IA"
create_placeholder "file-upload.png" "Téléchargement de Fichiers" "Interface de upload PDF avec glisser-déposer"
create_placeholder "ai-config.png" "Configuration IA" "Sélection des providers: OpenAI, Azure OpenAI, Mistral AI"
create_placeholder "quiz-generation.png" "Génération de Quiz" "Interface de paramétrage et génération automatique"
create_placeholder "question-review.png" "Révision des Questions" "Interface de révision et modification des questions générées"
create_placeholder "elea-integration.png" "Intégration Éléa" "Interface d'export et déploiement vers Éléa/Moodle"
create_placeholder "mistral-cli.png" "CLI Mistral" "Interface en ligne de commande pour Mistral AI" 1200 800
create_placeholder "architecture.png" "Architecture du Système" "Diagramme de l'architecture technique" 1600 1200

echo "✅ Images placeholder créées dans docs/screenshots/"
echo "📁 $(ls -la docs/screenshots/ | wc -l) fichiers créés"
