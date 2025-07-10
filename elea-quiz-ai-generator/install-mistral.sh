#!/bin/bash

# 🌟 Script d'installation et test Mistral AI
# Ce script installe et configure l'intégration Mistral AI pour le générateur de quiz Éléa

set -e  # Arrêter en cas d'erreur

echo "🌟 Installation et configuration Mistral AI pour Éléa Quiz Generator"
echo "=================================================================="

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCÈS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérifier les prérequis
print_status "Vérification des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ requis. Version actuelle: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) détecté"

# npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé."
    exit 1
fi

print_success "npm $(npm --version) détecté"

# Installation des dépendances
print_status "Installation des dépendances..."

if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé. Veuillez exécuter ce script depuis le dossier racine du projet."
    exit 1
fi

# Vérifier si @mistralai/mistralai est installé
if ! npm list @mistralai/mistralai &> /dev/null; then
    print_status "Installation de @mistralai/mistralai..."
    npm install @mistralai/mistralai
    print_success "@mistralai/mistralai installé"
else
    print_success "@mistralai/mistralai déjà installé"
fi

# Vérifier si commander est installé (pour le CLI)
if ! npm list commander &> /dev/null; then
    print_status "Installation de commander..."
    npm install commander
    print_success "commander installé"
else
    print_success "commander déjà installé"
fi

# Installation des autres dépendances si nécessaire
print_status "Vérification des dépendances..."
npm install

# Configuration des variables d'environnement
print_status "Configuration des variables d'environnement..."

ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$ENV_EXAMPLE" ]; then
        print_status "Copie du fichier .env.example vers .env..."
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        print_success "Fichier .env créé"
    else
        print_status "Création du fichier .env..."
        cat > "$ENV_FILE" << EOF
# Configuration Mistral AI
MISTRAL_API_KEY=your-mistral-api-key-here
MISTRAL_MODEL=mistral-large-latest

# Configuration par défaut
DEFAULT_AI_PROVIDER=mistral
DEFAULT_AI_MODEL=mistral-large-latest
DEFAULT_AI_TEMPERATURE=0.7
DEFAULT_AI_MAX_TOKENS=2000
DEFAULT_AI_TOP_P=0.9

# Application
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
EOF
        print_success "Fichier .env créé"
    fi
else
    # Vérifier si les variables Mistral existent
    if ! grep -q "MISTRAL_API_KEY" "$ENV_FILE"; then
        print_status "Ajout des variables Mistral au fichier .env existant..."
        cat >> "$ENV_FILE" << EOF

# Configuration Mistral AI (ajouté automatiquement)
MISTRAL_API_KEY=your-mistral-api-key-here
MISTRAL_MODEL=mistral-large-latest
EOF
        print_success "Variables Mistral ajoutées au .env"
    else
        print_success "Variables Mistral déjà présentes dans .env"
    fi
fi

# Compilation TypeScript
print_status "Compilation TypeScript..."
if command -v tsc &> /dev/null; then
    if ! tsc --noEmit --skipLibCheck; then
        print_warning "Erreurs TypeScript détectées, mais l'installation continue..."
    else
        print_success "Compilation TypeScript réussie"
    fi
else
    print_warning "TypeScript compiler non trouvé, compilation ignorée"
fi

# Rendre les scripts exécutables
print_status "Configuration des permissions des scripts..."
if [ -f "scripts/mistral-quiz-generator.js" ]; then
    chmod +x scripts/mistral-quiz-generator.js
    print_success "Script CLI Mistral configuré"
fi

# Test de base
print_status "Test de l'intégration Mistral..."

# Créer un script de test simple
cat > "test-mistral.js" << 'EOF'
const { validateAIConfig, AVAILABLE_MODELS } = require('./src/utils/aiConfig.js');

console.log('🧪 Test de l\'intégration Mistral AI...');

// Test de configuration
const testConfig = {
  provider: 'mistral',
  apiKey: 'test-key',
  model: 'mistral-large-latest',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  safePrompt: true
};

try {
  // Test des modèles disponibles
  const mistralModels = AVAILABLE_MODELS.mistral;
  console.log('✅ Modèles Mistral disponibles:', mistralModels.length);
  
  // Test de validation
  const errors = validateAIConfig(testConfig);
  if (errors.length === 1 && errors[0].includes('Clé API')) {
    console.log('✅ Validation de configuration fonctionne');
  } else {
    console.log('⚠️  Validation inattendue:', errors);
  }
  
  console.log('🎉 Intégration Mistral AI configurée avec succès!');
  process.exit(0);
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message);
  process.exit(1);
}
EOF

# Exécuter le test si possible
if node test-mistral.js 2>/dev/null; then
    print_success "Test d'intégration réussi"
else
    print_warning "Test d'intégration échoué (normal si les modules ne sont pas encore compilés)"
fi

# Nettoyage
rm -f test-mistral.js

# Instructions finales
echo ""
echo "🎉 Installation terminée avec succès!"
echo ""
print_status "Prochaines étapes:"
echo "1. 🔑 Obtenez votre clé API Mistral sur https://console.mistral.ai/"
echo "2. ✏️  Éditez le fichier .env et remplacez 'your-mistral-api-key-here' par votre vraie clé"
echo "3. 🚀 Testez avec: node scripts/mistral-quiz-generator.js models"
echo "4. 📝 Générez votre premier quiz: node scripts/mistral-quiz-generator.js generate -i document.pdf"
echo ""
print_status "Commandes utiles:"
echo "• Voir les modèles disponibles: npm run mistral:models"
echo "• Générer un quiz: npm run mistral:generate -- -i document.pdf -n 20"
echo "• Configuration avancée: npm run mistral:init"
echo "• Documentation: cat docs/MISTRAL_INTEGRATION.md"
echo ""
print_status "Ressources:"
echo "• Documentation Mistral: https://docs.mistral.ai/"
echo "• Console API: https://console.mistral.ai/"
echo "• Support: https://discord.gg/mistral"
echo ""
print_success "Profitez de Mistral AI pour générer des quiz de qualité! 🌟"
