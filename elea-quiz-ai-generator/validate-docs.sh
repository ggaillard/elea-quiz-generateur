#!/bin/bash

# Script de validation de la documentation
# Vérifie les liens, images et références

echo "📚 Validation de la Documentation Éléa Quiz AI Generator"
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Fonction pour afficher les résultats
check_result() {
    local test_name=$1
    local result=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$result" -eq 0 ]; then
        echo -e "${GREEN}✅ $test_name${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $test_name${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        check_result "$description" 0
    else
        check_result "$description" 1
        echo -e "${YELLOW}   Fichier manquant: $file${NC}"
    fi
}

# Fonction pour vérifier l'existence d'un dossier
check_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        check_result "$description" 0
    else
        check_result "$description" 1
        echo -e "${YELLOW}   Dossier manquant: $dir${NC}"
    fi
}

# Fonction pour vérifier le contenu d'un fichier
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        check_result "$description" 0
    else
        check_result "$description" 1
        echo -e "${YELLOW}   Contenu manquant dans $file: $pattern${NC}"
    fi
}

echo -e "${BLUE}🔍 Vérification des fichiers de documentation...${NC}"

# Vérification des fichiers principaux
check_file "docs/README.md" "Fichier README principal de la documentation"
check_file "docs/DOCUMENTATION_COMPLETE.md" "Documentation complète avec screenshots"
check_file "docs/GUIDE_UTILISATION.md" "Guide d'utilisation détaillé"
check_file "docs/MISTRAL_INTEGRATION.md" "Guide d'intégration Mistral"
check_file "MISTRAL_COMPLETE.md" "Guide complet Mistral (racine)"
check_file "README.md" "README principal du projet"

echo -e "${BLUE}🖼️  Vérification des screenshots...${NC}"

# Vérification du dossier screenshots
check_directory "docs/screenshots" "Dossier screenshots"

# Vérification des images
check_file "docs/screenshots/home-page.png" "Screenshot - Page d'accueil"
check_file "docs/screenshots/file-upload.png" "Screenshot - Upload de fichiers"
check_file "docs/screenshots/ai-config.png" "Screenshot - Configuration IA"
check_file "docs/screenshots/quiz-generation.png" "Screenshot - Génération de quiz"
check_file "docs/screenshots/question-review.png" "Screenshot - Révision des questions"
check_file "docs/screenshots/elea-integration.png" "Screenshot - Intégration Éléa"
check_file "docs/screenshots/mistral-cli.png" "Screenshot - CLI Mistral"
check_file "docs/screenshots/architecture.png" "Screenshot - Architecture"

echo -e "${BLUE}📄 Vérification du contenu des documents...${NC}"

# Vérification du contenu des documents
check_content "docs/README.md" "Éléa Quiz AI Generator" "Titre principal dans README"
check_content "docs/DOCUMENTATION_COMPLETE.md" "screenshots" "Références aux screenshots"
check_content "docs/GUIDE_UTILISATION.md" "CLI Mistral" "Section CLI Mistral"
check_content "docs/MISTRAL_INTEGRATION.md" "Mistral AI" "Mentions Mistral AI"

echo -e "${BLUE}🔗 Vérification des liens internes...${NC}"

# Vérification des liens vers les screenshots
check_content "docs/DOCUMENTATION_COMPLETE.md" "./screenshots/home-page.png" "Lien screenshot page d'accueil"
check_content "docs/DOCUMENTATION_COMPLETE.md" "./screenshots/ai-config.png" "Lien screenshot configuration IA"
check_content "docs/GUIDE_UTILISATION.md" "./screenshots/mistral-cli.png" "Lien screenshot CLI Mistral"

echo -e "${BLUE}⚙️  Vérification des fichiers de configuration...${NC}"

# Vérification des fichiers de configuration
check_file ".env.example" "Fichier exemple d'environnement"
check_file "mistral-config.json" "Fichier de configuration Mistral"
check_file "package.json" "Fichier package.json"
check_file "vitest.config.ts" "Configuration Vitest"

echo -e "${BLUE}🧪 Vérification des scripts...${NC}"

# Vérification des scripts
check_file "scripts/mistral-quiz-generator.cjs" "Script CLI Mistral"
check_file "take-screenshots.sh" "Script de génération de screenshots"
check_file "create-placeholders.sh" "Script de création de placeholders"
check_file "install-mistral.sh" "Script d'installation Mistral"

echo -e "${BLUE}📦 Vérification des scripts npm...${NC}"

# Vérification des scripts npm
check_content "package.json" "mistral:generate" "Script npm mistral:generate"
check_content "package.json" "mistral:models" "Script npm mistral:models"
check_content "package.json" "mistral:init" "Script npm mistral:init"
check_content "package.json" "docs:screenshots" "Script npm docs:screenshots"

echo -e "${BLUE}🎯 Vérification des exemples...${NC}"

# Vérification des exemples
check_directory "src/examples" "Dossier exemples"
check_file "src/examples/mistral-example.ts" "Exemple d'utilisation Mistral"

echo -e "${BLUE}🧪 Vérification des tests...${NC}"

# Vérification des tests
check_directory "src/tests" "Dossier tests"
check_file "src/tests/simple.test.ts" "Tests simples"
check_file "src/tests/functional.test.ts" "Tests fonctionnels"
check_file "src/tests/integration.test.ts" "Tests d'intégration"

echo -e "${BLUE}🔧 Vérification des types et services...${NC}"

# Vérification des fichiers principaux
check_file "src/types/index.ts" "Définitions de types"
check_file "src/services/aiService.ts" "Service IA"
check_file "src/utils/aiConfig.ts" "Utilitaire configuration IA"
check_file "src/components/AIProviderSelector.tsx" "Composant sélecteur de provider"

echo ""
echo "=================================================="
echo -e "${BLUE}📊 Résultats de la validation${NC}"
echo "=================================================="
echo -e "Total des vérifications: ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Réussies: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Échouées: ${RED}$FAILED_CHECKS${NC}"

# Calcul du pourcentage
if [ "$TOTAL_CHECKS" -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo -e "Taux de réussite: ${BLUE}$SUCCESS_RATE%${NC}"
else
    echo -e "Taux de réussite: ${RED}0%${NC}"
fi

echo ""

if [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "${GREEN}🎉 Validation complète réussie !${NC}"
    echo -e "${GREEN}✅ Tous les fichiers de documentation sont présents et corrects.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Validation partiellement réussie${NC}"
    echo -e "${YELLOW}$FAILED_CHECKS éléments nécessitent votre attention.${NC}"
    exit 1
fi
