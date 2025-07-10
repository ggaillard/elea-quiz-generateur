#!/bin/bash

# Script pour prendre des screenshots du projet Éléa Quiz AI Generator
# Utilise Puppeteer pour capturer les interfaces web

echo "🖼️  Génération des screenshots pour la documentation..."

# Créer le dossier screenshots s'il n'existe pas
mkdir -p docs/screenshots

# Démarrer le serveur de développement en arrière-plan
echo "🚀 Démarrage du serveur de développement..."
npm run dev &
SERVER_PID=$!

# Attendre que le serveur soit prêt
echo "⏳ Attente du démarrage du serveur..."
sleep 10

# Fonction pour prendre un screenshot
take_screenshot() {
    local url=$1
    local filename=$2
    local description=$3
    
    echo "📸 Capture: $description"
    
    # Utiliser Puppeteer pour capturer la page
    node -e "
    const puppeteer = require('puppeteer');
    
    (async () => {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        try {
            await page.goto('$url', { waitUntil: 'networkidle0', timeout: 30000 });
            await page.waitForTimeout(2000);
            await page.screenshot({ 
                path: 'docs/screenshots/$filename', 
                fullPage: true,
                quality: 90
            });
            console.log('✅ Screenshot sauvegardé: docs/screenshots/$filename');
        } catch (error) {
            console.error('❌ Erreur lors de la capture:', error.message);
        } finally {
            await browser.close();
        }
    })();
    " 2>/dev/null || echo "❌ Erreur lors de la capture de $filename"
}

# Vérifier si Puppeteer est installé
if ! npm list puppeteer &>/dev/null; then
    echo "📦 Installation de Puppeteer..."
    npm install --save-dev puppeteer
fi

# Prendre les screenshots des différentes pages
echo "📸 Capture des screenshots..."

# Page d'accueil
take_screenshot "http://localhost:5173" "home-page.png" "Page d'accueil"

# Interface de téléchargement
take_screenshot "http://localhost:5173/#/upload" "file-upload.png" "Interface de téléchargement de fichiers"

# Configuration IA
take_screenshot "http://localhost:5173/#/config" "ai-config.png" "Configuration des providers IA"

# Interface de génération
take_screenshot "http://localhost:5173/#/generate" "quiz-generation.png" "Interface de génération de quiz"

# Révision des questions
take_screenshot "http://localhost:5173/#/review" "question-review.png" "Interface de révision des questions"

# Intégration Éléa
take_screenshot "http://localhost:5173/#/elea" "elea-integration.png" "Interface d'intégration Éléa"

# Arrêter le serveur
echo "🛑 Arrêt du serveur de développement..."
kill $SERVER_PID 2>/dev/null || true

# Créer des images placeholder si les screenshots ont échoué
echo "🎨 Création des images placeholder..."
./create-placeholders.sh

echo "✅ Screenshots terminés! Vérifiez le dossier docs/screenshots/"
echo "📁 $(ls -la docs/screenshots/ | wc -l) fichiers générés"
