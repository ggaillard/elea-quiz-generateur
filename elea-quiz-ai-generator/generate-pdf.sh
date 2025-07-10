#!/bin/bash

# Script pour générer une version PDF de la documentation
# Utilise pandoc pour convertir Markdown en PDF

echo "📄 Génération PDF de la Documentation Éléa Quiz AI Generator"
echo "============================================================"

# Vérifier si pandoc est installé
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc n'est pas installé. Installation..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y pandoc texlive-latex-recommended texlive-fonts-recommended
    elif command -v brew &> /dev/null; then
        brew install pandoc basictex
    else
        echo "❌ Impossible d'installer pandoc automatiquement."
        echo "Veuillez l'installer manuellement: https://pandoc.org/installing.html"
        exit 1
    fi
fi

# Créer le dossier de sortie
mkdir -p docs/pdf

# Fichier de configuration pandoc
cat > docs/pdf/pandoc-config.yaml << EOF
metadata:
  title: "Documentation Éléa Quiz AI Generator"
  author: "Équipe Éléa Quiz AI Generator"
  date: "$(date '+%d %B %Y')"
  subject: "Documentation technique et guide d'utilisation"
  keywords: "Éléa, Moodle, IA, Quiz, Mistral, OpenAI, Azure"
  lang: "fr"
  
pdf-engine: xelatex
toc: true
toc-depth: 3
number-sections: true
highlight-style: github
geometry: 
  - margin=2.5cm
  - papersize=a4
fontsize: 11pt
linestretch: 1.2
documentclass: article
classoption: 
  - onecolumn
  - twoside
header-includes:
  - |
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \fancyhead[L]{Éléa Quiz AI Generator}
    \fancyhead[R]{Documentation v1.0.0}
    \fancyfoot[C]{\thepage}
    \renewcommand{\headrulewidth}{0.4pt}
    \renewcommand{\footrulewidth}{0.4pt}
EOF

echo "📚 Génération du PDF principal..."

# Créer un fichier markdown combiné
cat > docs/pdf/documentation-complete.md << 'EOF'
# Documentation Éléa Quiz AI Generator

## Table des Matières Générale

1. [Vue d'ensemble](#vue-densemble)
2. [Installation et Configuration](#installation-et-configuration)
3. [Guide d'Utilisation](#guide-dutilisation)
4. [Intégration Mistral AI](#intégration-mistral-ai)
5. [Interface Utilisateur](#interface-utilisateur)
6. [CLI et Automation](#cli-et-automation)
7. [API et Développement](#api-et-développement)
8. [Déploiement et Maintenance](#déploiement-et-maintenance)
9. [Support et Ressources](#support-et-ressources)

---

EOF

# Ajouter le contenu des différents fichiers
echo "📄 Consolidation des documents..."

# README principal
echo "# Vue d'ensemble" >> docs/pdf/documentation-complete.md
echo "" >> docs/pdf/documentation-complete.md
tail -n +2 README.md >> docs/pdf/documentation-complete.md
echo -e "\n\n---\n" >> docs/pdf/documentation-complete.md

# Guide d'utilisation
echo "# Guide d'Utilisation Détaillé" >> docs/pdf/documentation-complete.md
echo "" >> docs/pdf/documentation-complete.md
tail -n +2 docs/GUIDE_UTILISATION.md >> docs/pdf/documentation-complete.md
echo -e "\n\n---\n" >> docs/pdf/documentation-complete.md

# Intégration Mistral
echo "# Intégration Mistral AI" >> docs/pdf/documentation-complete.md
echo "" >> docs/pdf/documentation-complete.md
tail -n +2 docs/MISTRAL_INTEGRATION.md >> docs/pdf/documentation-complete.md
echo -e "\n\n---\n" >> docs/pdf/documentation-complete.md

# Documentation complète
echo "# Documentation Technique Complète" >> docs/pdf/documentation-complete.md
echo "" >> docs/pdf/documentation-complete.md
tail -n +2 docs/DOCUMENTATION_COMPLETE.md >> docs/pdf/documentation-complete.md

# Génération du PDF
echo "🔄 Conversion en PDF..."
pandoc docs/pdf/documentation-complete.md \
  --defaults docs/pdf/pandoc-config.yaml \
  --resource-path docs/screenshots \
  --output docs/pdf/elea-quiz-ai-generator-documentation.pdf \
  --verbose

if [ $? -eq 0 ]; then
    echo "✅ PDF généré avec succès: docs/pdf/elea-quiz-ai-generator-documentation.pdf"
    
    # Informations sur le fichier généré
    echo ""
    echo "📊 Informations sur le fichier:"
    ls -lh docs/pdf/elea-quiz-ai-generator-documentation.pdf
    
    # Compter les pages (si pdfinfo est disponible)
    if command -v pdfinfo &> /dev/null; then
        PAGES=$(pdfinfo docs/pdf/elea-quiz-ai-generator-documentation.pdf | grep "Pages:" | awk '{print $2}')
        echo "📄 Nombre de pages: $PAGES"
    fi
else
    echo "❌ Erreur lors de la génération du PDF"
    exit 1
fi

# Générer un PDF résumé pour impression
echo ""
echo "📋 Génération d'un résumé pour impression..."

cat > docs/pdf/resume.md << 'EOF'
# Éléa Quiz AI Generator - Résumé

## Installation Rapide

```bash
git clone https://github.com/votre-org/elea-quiz-ai-generator.git
cd elea-quiz-ai-generator
npm install
cp .env.example .env
# Configurer MISTRAL_API_KEY
npm run dev
```

## Configuration Mistral

```json
{
  "provider": "mistral",
  "model": "mistral-large-latest",
  "temperature": 0.7,
  "safePrompt": true
}
```

## Commandes CLI Essentielles

```bash
# Voir les modèles
npm run mistral:models

# Créer une configuration
npm run mistral:init

# Générer un quiz
npm run mistral:generate -- --input cours.pdf --count 20

# Génération avancée
npm run mistral:generate -- \
  --input cours.pdf \
  --model mistral-large-latest \
  --level advanced \
  --safe-prompt \
  --format moodle
```

## Types de Questions

- **QCM** - Questions à choix multiples
- **Vrai/Faux** - Questions binaires
- **Réponse courte** - Réponses textuelles
- **Appariement** - Association d'éléments
- **Mixed** - Combinaison de types

## Formats d'Export

- **JSON** - Format structuré
- **XML Moodle** - Import direct Moodle
- **GIFT** - Format texte Moodle
- **CSV** - Compatible tableur

## Modèles Mistral

| Modèle | Usage | Coût | Performance |
|--------|-------|------|-------------|
| mistral-large-latest | Production | €€€ | ⭐⭐⭐⭐⭐ |
| mistral-medium-latest | Développement | €€ | ⭐⭐⭐⭐ |
| mistral-small-latest | Tests | € | ⭐⭐⭐ |

## Variables d'Environnement

```env
MISTRAL_API_KEY=your-key-here
MISTRAL_MODEL=mistral-large-latest
ELEA_API_URL=https://elea.ac-toulouse.fr/api
ELEA_API_KEY=your-elea-key
```

## Support

- Email: support@elea-quiz-ai.com
- Discord: https://discord.gg/elea-quiz-ai
- GitHub: https://github.com/votre-org/elea-quiz-ai-generator
EOF

# Générer le PDF résumé
pandoc docs/pdf/resume.md \
  --output docs/pdf/elea-quiz-ai-generator-resume.pdf \
  --pdf-engine xelatex \
  --variable geometry:margin=2cm \
  --variable fontsize=10pt \
  --variable documentclass=article \
  --variable classoption=onecolumn \
  --toc \
  --highlight-style github

if [ $? -eq 0 ]; then
    echo "✅ PDF résumé généré: docs/pdf/elea-quiz-ai-generator-resume.pdf"
else
    echo "❌ Erreur lors de la génération du PDF résumé"
fi

# Nettoyer les fichiers temporaires
rm -f docs/pdf/documentation-complete.md docs/pdf/resume.md docs/pdf/pandoc-config.yaml

echo ""
echo "🎉 Génération terminée !"
echo "📁 Fichiers générés dans docs/pdf/"
ls -la docs/pdf/
