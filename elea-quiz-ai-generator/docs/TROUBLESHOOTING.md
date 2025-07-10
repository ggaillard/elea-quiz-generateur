# 🛠️ Troubleshooting - Éléa Quiz AI Generator

## Problèmes Courants et Solutions

### 🔑 Problèmes d'API Mistral

#### Erreur: "Invalid API Key"
```bash
Error: 401 Unauthorized - Invalid API key
```

**Solutions:**
1. Vérifier la clé API dans `.env`:
   ```env
   MISTRAL_API_KEY=your-actual-api-key
   ```
2. Régénérer une nouvelle clé sur [console.mistral.ai](https://console.mistral.ai)
3. Vérifier les droits d'accès de la clé

#### Erreur: "Model not found"
```bash
Error: Model 'mistral-wrong-name' not found
```

**Solutions:**
1. Utiliser les modèles corrects:
   ```bash
   npm run mistral:models  # Voir les modèles disponibles
   ```
2. Modèles valides:
   - `mistral-large-latest`
   - `mistral-medium-latest`
   - `mistral-small-latest`

#### Erreur: "Rate limit exceeded"
```bash
Error: 429 Too Many Requests
```

**Solutions:**
1. Attendre avant de relancer
2. Réduire la fréquence des appels
3. Upgrader le plan Mistral si nécessaire

### 📄 Problèmes de Traitement PDF

#### Erreur: "Cannot read PDF"
```bash
Error: Failed to extract text from PDF
```

**Solutions:**
1. Vérifier que le PDF n'est pas protégé par mot de passe
2. Convertir le PDF en version compatible
3. Utiliser un PDF avec du texte (pas uniquement des images)

#### PDF trop volumineux
```bash
Error: File size exceeds limit
```

**Solutions:**
1. Compresser le PDF
2. Diviser en plusieurs fichiers plus petits
3. Augmenter la limite dans la configuration

### ⚙️ Problèmes de Configuration

#### Variables d'environnement manquantes
```bash
Error: MISTRAL_API_KEY is required
```

**Solutions:**
1. Copier le fichier d'exemple:
   ```bash
   cp .env.example .env
   ```
2. Configurer toutes les variables requises:
   ```env
   MISTRAL_API_KEY=your-key
   MISTRAL_MODEL=mistral-large-latest
   ```

#### Configuration TypeScript
```bash
Error: Cannot find module '@mistralai/mistralai'
```

**Solutions:**
1. Réinstaller les dépendances:
   ```bash
   npm install
   ```
2. Installer Mistral AI spécifiquement:
   ```bash
   npm install @mistralai/mistralai
   ```

### 🖥️ Problèmes CLI

#### Command not found
```bash
npm ERR! Missing script: "mistral:generate"
```

**Solutions:**
1. Vérifier le package.json:
   ```json
   {
     "scripts": {
       "mistral:generate": "node scripts/mistral-quiz-generator.cjs generate"
     }
   }
   ```
2. Réinstaller le projet:
   ```bash
   npm run mistral:install
   ```

#### Script permission denied
```bash
Error: Permission denied
```

**Solutions:**
1. Donner les permissions d'exécution:
   ```bash
   chmod +x scripts/mistral-quiz-generator.cjs
   chmod +x install-mistral.sh
   ```

### 🌐 Problèmes de Serveur Web

#### Port déjà utilisé
```bash
Error: Port 5173 already in use
```

**Solutions:**
1. Arrêter le processus existant:
   ```bash
   pkill -f "vite"
   ```
2. Utiliser un autre port:
   ```bash
   npm run dev -- --port 3001
   ```

#### Build failed
```bash
Error: Build failed with errors
```

**Solutions:**
1. Nettoyer le cache:
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```
2. Vérifier les erreurs TypeScript:
   ```bash
   npx tsc --noEmit
   ```

### 🔧 Problèmes de Génération

#### Questions de mauvaise qualité
**Symptômes:** Questions répétitives, réponses incorrectes

**Solutions:**
1. Ajuster la température:
   ```typescript
   const config = {
     temperature: 0.7, // Plus créatif
     safePrompt: true
   };
   ```
2. Utiliser un modèle plus performant:
   ```bash
   npm run mistral:generate -- --model mistral-large-latest
   ```
3. Améliorer le prompt système

#### Génération trop lente
**Solutions:**
1. Utiliser un modèle plus rapide:
   ```bash
   npm run mistral:generate -- --model mistral-small-latest
   ```
2. Réduire le nombre de questions:
   ```bash
   npm run mistral:generate -- --count 5
   ```

### 📊 Problèmes d'Export

#### Format Moodle incorrect
```bash
Error: Invalid Moodle XML format
```

**Solutions:**
1. Vérifier le format des questions
2. Utiliser le format GIFT comme alternative:
   ```bash
   npm run mistral:generate -- --format gift
   ```

#### Caractères spéciaux
**Solutions:**
1. Configurer l'encodage UTF-8
2. Éviter les caractères non supportés

### 🚀 Optimisation Performance

#### Améliorer la vitesse
1. **Cache des résultats:**
   ```typescript
   const useCache = true;
   ```

2. **Traitement par lots:**
   ```bash
   npm run batch:process -- --folder ./documents
   ```

3. **Modèle optimisé:**
   ```bash
   # Pour la vitesse
   MISTRAL_MODEL=mistral-small-latest
   
   # Pour la qualité
   MISTRAL_MODEL=mistral-large-latest
   ```

### 📞 Support et Aide

#### Logs de debug
1. Activer les logs détaillés:
   ```env
   LOG_LEVEL=debug
   NODE_ENV=development
   ```

2. Consulter les logs:
   ```bash
   tail -f logs/app.log
   ```

#### Communauté et Support
- 💬 **Discord:** [Communauté Éléa](https://discord.gg/elea)
- 📧 **Email:** support@elea-quiz-generator.com
- 📚 **Documentation:** [docs/](./docs/)
- 🐛 **Issues GitHub:** [GitHub Issues](https://github.com/votre-org/elea-quiz-ai-generator/issues)

#### Signaler un bug
1. **Informations à fournir:**
   - Version Node.js: `node --version`
   - Version du projet: `npm list elea-quiz-ai-generator`
   - Logs d'erreur complets
   - Configuration utilisée
   - Fichier de test (si possible)

2. **Template de bug report:**
   ```markdown
   ## Bug Description
   Description claire du problème
   
   ## Steps to Reproduce
   1. Action 1
   2. Action 2
   3. Erreur observée
   
   ## Expected Behavior
   Comportement attendu
   
   ## Environment
   - OS: [e.g., Ubuntu 20.04]
   - Node.js: [e.g., 18.15.0]
   - Project version: [e.g., 1.0.0]
   
   ## Error Logs
   ```
   Logs d'erreur ici
   ```
   ```

---

Cette documentation de troubleshooting couvre les problèmes les plus fréquents. N'hésitez pas à contribuer en ajoutant de nouveaux cas d'usage et solutions!
