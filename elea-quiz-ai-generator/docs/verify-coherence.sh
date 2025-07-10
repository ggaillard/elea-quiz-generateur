#!/bin/bash

# Script de vérification de cohérence de la documentation
echo "🔍 Vérification de Cohérence - Documentation Éléa Quiz AI Generator"
echo "===================================================================="

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        return 0
    else
        echo "❌ $1 (manquant)"
        return 1
    fi
}

# Fonction pour vérifier l'existence d'un dossier
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        return 0
    else
        echo "❌ $1/ (manquant)"
        return 1
    fi
}

# 1. Vérification des fichiers principaux
echo ""
echo "📄 Fichiers Principaux:"
echo "-----------------------"
check_file "README.md"
check_file "package.json"
check_file ".env.example"
check_file "mistral-config.json"

# 2. Vérification de la structure docs/
echo ""
echo "📚 Structure Documentation:"
echo "---------------------------"
check_dir "docs"
check_file "docs/COMPLETE_DOCUMENTATION.md"
check_file "docs/MISTRAL_INTEGRATION.md"
check_dir "docs/diagrams"
check_dir "docs/screenshots"

# 3. Vérification des diagrammes SVG
echo ""
echo "📊 Diagrammes SVG:"
echo "------------------"
check_file "docs/diagrams/architecture.svg"
check_file "docs/diagrams/workflow.svg"
check_file "docs/diagrams/providers-comparison.svg"
check_file "docs/diagrams/ui-mockup.svg"
check_file "docs/diagrams/mistral-config.svg"

# 4. Vérification des screenshots
echo ""
echo "📸 Screenshots:"
echo "---------------"
screenshot_files=(
    "home-page.png"
    "file-upload.png"
    "ai-config.png"
    "quiz-generation.png"
    "question-review.png"
    "elea-integration.png"
)

for file in "${screenshot_files[@]}"; do
    check_file "docs/screenshots/$file"
done

# 5. Vérification des scripts
echo ""
echo "⚙️ Scripts:"
echo "-----------"
check_file "scripts/mistral-quiz-generator.cjs"
check_file "install-mistral.sh"
check_file "take-screenshots.sh"
check_file "create-placeholders.sh"

# 6. Vérification des sources TypeScript
echo ""
echo "💻 Sources TypeScript:"
echo "---------------------"
check_dir "src"
check_file "src/types/index.ts"
check_file "src/services/aiService.ts"
check_file "src/utils/aiConfig.ts"
check_file "src/components/AIProviderSelector.tsx"

# 7. Analyse des références dans README.md
echo ""
echo "🔗 Analyse des Références README.md:"
echo "------------------------------------"
if [ -f "README.md" ]; then
    # Vérifier les liens vers la documentation
    grep -n "\[.*\](.*docs.*)" README.md | while read line; do
        echo "📋 $line"
    done
    
    # Vérifier les mentions de Mistral
    mistral_count=$(grep -c -i "mistral" README.md)
    echo "🤖 Mentions Mistral AI: $mistral_count"
    
    # Vérifier les badges
    badge_count=$(grep -c "badge" README.md)
    echo "🏆 Badges: $badge_count"
else
    echo "❌ README.md manquant"
fi

# 8. Analyse des références dans COMPLETE_DOCUMENTATION.md
echo ""
echo "📖 Analyse Documentation Complète:"
echo "----------------------------------"
if [ -f "docs/COMPLETE_DOCUMENTATION.md" ]; then
    # Vérifier les liens vers les SVG
    svg_links=$(grep -c "\.svg" docs/COMPLETE_DOCUMENTATION.md)
    echo "🎨 Liens SVG: $svg_links"
    
    # Vérifier les liens vers les screenshots
    screenshot_links=$(grep -c "screenshots/" docs/COMPLETE_DOCUMENTATION.md)
    echo "📸 Liens Screenshots: $screenshot_links"
    
    # Vérifier la table des matières
    toc_count=$(grep -c "^- \[" docs/COMPLETE_DOCUMENTATION.md)
    echo "📑 Table des matières: $toc_count entrées"
else
    echo "❌ Documentation complète manquante"
fi

# 9. Vérification des exemples de code
echo ""
echo "💡 Exemples de Code:"
echo "-------------------"
if [ -f "docs/COMPLETE_DOCUMENTATION.md" ]; then
    # Compter les blocs de code
    code_blocks=$(grep -c '```' docs/COMPLETE_DOCUMENTATION.md)
    echo "📝 Blocs de code: $((code_blocks / 2))"
    
    # Vérifier les exemples TypeScript
    ts_examples=$(grep -c '```typescript' docs/COMPLETE_DOCUMENTATION.md)
    echo "🔷 Exemples TypeScript: $ts_examples"
    
    # Vérifier les exemples bash
    bash_examples=$(grep -c '```bash' docs/COMPLETE_DOCUMENTATION.md)
    echo "⚡ Exemples Bash: $bash_examples"
fi

# 10. Validation des configurations
echo ""
echo "⚙️ Validation Configurations:"
echo "-----------------------------"

# Vérifier package.json
if [ -f "package.json" ]; then
    if grep -q "mistral" package.json; then
        echo "✅ Scripts Mistral présents dans package.json"
    else
        echo "⚠️  Scripts Mistral manquants dans package.json"
    fi
    
    if grep -q "@mistralai/mistralai" package.json; then
        echo "✅ Dépendance Mistral AI présente"
    else
        echo "❌ Dépendance Mistral AI manquante"
    fi
fi

# Vérifier .env.example
if [ -f ".env.example" ]; then
    if grep -q "MISTRAL_API_KEY" .env.example; then
        echo "✅ Variables Mistral dans .env.example"
    else
        echo "❌ Variables Mistral manquantes dans .env.example"
    fi
fi

# 11. Cohérence des versions et noms
echo ""
echo "🔄 Cohérence Versions et Noms:"
echo "------------------------------"

# Extraire le nom du projet depuis package.json
if [ -f "package.json" ]; then
    project_name=$(grep '"name"' package.json | cut -d'"' -f4)
    echo "📦 Nom du projet: $project_name"
    
    # Vérifier si le nom est cohérent dans README
    if grep -q "$project_name" README.md 2>/dev/null; then
        echo "✅ Nom cohérent dans README.md"
    else
        echo "⚠️  Nom incohérent dans README.md"
    fi
fi

# 12. Résumé des problèmes
echo ""
echo "📊 Résumé de Cohérence:"
echo "-----------------------"

total_files=0
missing_files=0

# Compter les fichiers essentiels
essential_files=(
    "README.md"
    "docs/COMPLETE_DOCUMENTATION.md"
    "docs/diagrams/architecture.svg"
    "docs/diagrams/workflow.svg"
    "docs/diagrams/providers-comparison.svg"
    "src/services/aiService.ts"
    "scripts/mistral-quiz-generator.cjs"
)

for file in "${essential_files[@]}"; do
    total_files=$((total_files + 1))
    if [ ! -f "$file" ]; then
        missing_files=$((missing_files + 1))
    fi
done

present_files=$((total_files - missing_files))
coherence_score=$((present_files * 100 / total_files))

echo "📈 Score de cohérence: $coherence_score% ($present_files/$total_files fichiers)"

if [ $coherence_score -ge 90 ]; then
    echo "🎉 Excellente cohérence de documentation!"
elif [ $coherence_score -ge 75 ]; then
    echo "👍 Bonne cohérence, quelques améliorations possibles"
elif [ $coherence_score -ge 50 ]; then
    echo "⚠️  Cohérence modérée, révision recommandée"
else
    echo "❌ Cohérence faible, révision majeure nécessaire"
fi

echo ""
echo "✨ Vérification terminée!"
