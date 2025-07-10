# 🔧 API Documentation - Mistral AI Integration

## Overview

Cette documentation présente l'API complète pour l'intégration de Mistral AI dans le générateur de quiz Éléa.

## Service AI - Mistral Implementation

### Configuration

```typescript
interface MistralConfig {
  provider: 'mistral';
  apiKey: string;
  model: MistralModel;
  temperature: number;
  maxTokens: number;
  safePrompt: boolean;
}

type MistralModel = 
  | 'mistral-large-latest'
  | 'mistral-medium-latest' 
  | 'mistral-small-latest'
  | 'mistral-tiny';
```

### Endpoints

#### POST /api/generate
Génère un quiz depuis un document avec Mistral AI.

**Request:**
```json
{
  "file": "document.pdf",
  "config": {
    "provider": "mistral",
    "model": "mistral-large-latest",
    "questionCount": 10,
    "questionType": "mixed",
    "difficulty": "intermediate",
    "safePrompt": true
  }
}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "processing",
  "estimatedTime": 30
}
```

#### GET /api/models/mistral
Liste les modèles Mistral disponibles.

**Response:**
```json
{
  "models": [
    {
      "id": "mistral-large-latest",
      "name": "Mistral Large",
      "description": "Modèle le plus performant",
      "costPer1kTokens": 0.008
    }
  ]
}
```

## CLI Commands

### mistral:generate
```bash
npm run mistral:generate -- --input file.pdf --count 10 --type mcq
```

### mistral:models
```bash
npm run mistral:models
```

### mistral:init
```bash
npm run mistral:init
```

## Error Handling

```typescript
try {
  const quiz = await aiService.generateQuiz(content, options);
} catch (error) {
  if (error.code === 'MISTRAL_API_ERROR') {
    // Handle Mistral API error
  } else if (error.code === 'INVALID_CONFIG') {
    // Handle configuration error
  }
}
```
