# 🎓 Prompts Éducatifs - Mistral AI

## Overview

Collection de prompts optimisés pour la génération de quiz éducatifs avec Mistral AI.

## Prompts par Type de Question

### QCM (Questions à Choix Multiples)

```typescript
const MCQ_PROMPT = `
Tu es un expert pédagogique spécialisé dans la création de QCM.

Analyse le contenu suivant et génère {questionCount} questions à choix multiples de niveau {difficulty}.

Contenu à analyser:
{content}

Consignes strictes:
- Questions claires et sans ambiguïté
- 4 options de réponse (A, B, C, D)
- Une seule réponse correcte
- Distracteurs plausibles mais incorrects
- Explication pédagogique pour chaque réponse
- Vocabulaire adapté au niveau {difficulty}
- Respect du contexte français et européen

Format de réponse JSON uniquement:
{
  "questions": [
    {
      "question": "Texte de la question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explication détaillée de la réponse",
      "difficulty": "{difficulty}",
      "topic": "Sujet principal",
      "keywords": ["mot-clé1", "mot-clé2"]
    }
  ]
}
`;
```

### Vrai/Faux

```typescript
const TRUE_FALSE_PROMPT = `
Créé {questionCount} questions Vrai/Faux basées sur le contenu suivant.

Contenu:
{content}

Exigences:
- Affirmations claires et précises
- Éviter les questions piège
- Justification pédagogique obligatoire
- Niveau: {difficulty}

Format JSON:
{
  "questions": [
    {
      "question": "Affirmation à évaluer",
      "answer": true,
      "explanation": "Justification complète"
    }
  ]
}
`;
```

### Questions Ouvertes Courtes

```typescript
const SHORT_ANSWER_PROMPT = `
Génère {questionCount} questions ouvertes courtes (réponse en 1-3 mots).

Contenu source:
{content}

Critères:
- Réponse factuelle précise
- Pas d'interprétation subjective
- Niveau {difficulty}
- Vocabulaire technique approprié

Format JSON:
{
  "questions": [
    {
      "question": "Question précise",
      "acceptedAnswers": ["réponse1", "réponse2"],
      "hints": "Indice optionnel"
    }
  ]
}
`;
```

## Prompts Spécialisés par Domaine

### Sciences

```typescript
const SCIENCE_PROMPT = `
En tant qu'expert en sciences, crée des questions scientifiques rigoureuses.

Priorités:
- Concepts fondamentaux
- Méthode scientifique
- Données factuelles
- Liens entre théorie et pratique
- Respect de la nomenclature française

Contenu: {content}
`;
```

### Littérature

```typescript
const LITERATURE_PROMPT = `
Génère des questions littéraires approfondies.

Focus:
- Analyse textuelle
- Contexte historique
- Figures de style
- Thèmes et symboles
- Références culturelles françaises

Contenu: {content}
`;
```

### Histoire

```typescript
const HISTORY_PROMPT = `
Crée des questions historiques contextualisées.

Éléments clés:
- Chronologie précise
- Causes et conséquences
- Personnages historiques
- Contexte européen et français
- Sources historiques

Contenu: {content}
`;
```

## Prompts de Sécurité Éducative

### Safe Prompt pour Mistral

```typescript
const SAFE_EDUCATIONAL_PROMPT = `
[CONSIGNES DE SÉCURITÉ ÉDUCATIVE]

Tu dois impérativement:
✅ Créer du contenu approprié pour un contexte scolaire
✅ Éviter tout contenu polémique ou sensible
✅ Respecter la neutralité pédagogique
✅ Utiliser un vocabulaire adapté à l'âge
✅ Promouvoir les valeurs éducatives européennes

Tu dois absolument éviter:
❌ Contenu violent ou inapproprié
❌ Références controversées
❌ Biais politiques ou religieux
❌ Stéréotypes ou discriminations
❌ Informations non vérifiées

{basePrompt}
`;
```

## Optimisation pour le Français

### Prompt Linguistique

```typescript
const FRENCH_OPTIMIZATION_PROMPT = `
Optimisations spécifiques pour le français:

Grammaire:
- Accord des participes passés
- Conjugaisons correctes
- Syntaxe française standard

Vocabulaire:
- Terminologie française officielle
- Éviter les anglicismes
- Registre de langue approprié

Culture:
- Références culturelles françaises
- Contexte européen
- Exemples localisés

{questionPrompt}
`;
```

## Templates de Validation

### Validation Qualité

```typescript
const QUALITY_CHECK_PROMPT = `
Évalue la qualité des questions suivantes selon ces critères:

1. Clarté et précision
2. Niveau de difficulté approprié
3. Pertinence pédagogique
4. Qualité des distracteurs (QCM)
5. Justification des réponses

Questions à évaluer:
{generatedQuestions}

Format de réponse:
{
  "evaluation": {
    "score": 8.5,
    "suggestions": ["amélioration 1", "amélioration 2"],
    "approved": true
  }
}
`;
```

## Configuration des Prompts

### Paramètres Recommandés

```typescript
const PROMPT_CONFIG = {
  temperature: 0.7,        // Créativité contrôlée
  maxTokens: 2000,         // Réponses détaillées
  safePrompt: true,        // Sécurité éducative
  language: 'fr',          // Français prioritaire
  stopSequences: ['}'],    // Arrêt propre JSON
};
```

### Adaptation par Niveau

```typescript
const LEVEL_ADAPTATIONS = {
  beginner: {
    vocabulary: 'simple',
    complexity: 'basic',
    examples: 'concrets'
  },
  intermediate: {
    vocabulary: 'standard',
    complexity: 'moderate',
    examples: 'variés'
  },
  advanced: {
    vocabulary: 'technique',
    complexity: 'élevé',
    examples: 'abstraits'
  }
};
```

## Bonnes Pratiques

1. **Toujours utiliser le Safe Prompt** pour l'éducation
2. **Valider les réponses** avec un prompt de contrôle qualité
3. **Adapter le vocabulaire** selon le niveau cible
4. **Contextualiser** les exemples à la culture française
5. **Tester les prompts** avec différents contenus sources

---

Ces prompts sont optimisés pour Mistral AI et l'enseignement français. Ils garantissent une génération de contenu éducatif de qualité, sûr et adapté.
