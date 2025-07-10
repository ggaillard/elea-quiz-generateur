import { AIConfig } from '../types';

/**
 * Configurations par défaut pour les différents providers IA
 */
export const DEFAULT_AI_CONFIGS: Record<string, Partial<AIConfig>> = {
  openai: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
  },
  'azure-openai': {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
  },
  mistral: {
    model: 'mistral-large-latest',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    safePrompt: true,
  },
};

/**
 * Modèles disponibles pour chaque provider
 */
export const AVAILABLE_MODELS: Record<string, string[]> = {
  openai: [
    'gpt-4-turbo-preview',
    'gpt-4',
    'gpt-4-32k',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
  ],
  'azure-openai': [
    'gpt-4',
    'gpt-4-32k',
    'gpt-35-turbo',
    'gpt-35-turbo-16k',
  ],
  mistral: [
    'mistral-large-latest',
    'mistral-large-2402',
    'mistral-medium-latest',
    'mistral-medium-2312',
    'mistral-small-latest',
    'mistral-small-2402',
    'mistral-tiny',
    'open-mistral-7b',
    'open-mixtral-8x7b',
    'open-mixtral-8x22b',
  ],
};

/**
 * Limites de tokens par modèle
 */
export const MODEL_TOKEN_LIMITS: Record<string, number> = {
  // OpenAI
  'gpt-4-turbo-preview': 128000,
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-16k': 16384,
  
  // Azure OpenAI
  'gpt-35-turbo': 4096,
  'gpt-35-turbo-16k': 16384,
  
  // Mistral
  'mistral-large-latest': 32768,
  'mistral-large-2402': 32768,
  'mistral-medium-latest': 32768,
  'mistral-medium-2312': 32768,
  'mistral-small-latest': 32768,
  'mistral-small-2402': 32768,
  'mistral-tiny': 32768,
  'open-mistral-7b': 32768,
  'open-mixtral-8x7b': 32768,
  'open-mixtral-8x22b': 65536,
};

/**
 * Coûts approximatifs par 1000 tokens (en USD)
 */
export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  // OpenAI
  'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-32k': { input: 0.06, output: 0.12 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 },
  
  // Mistral
  'mistral-large-latest': { input: 0.008, output: 0.024 },
  'mistral-large-2402': { input: 0.008, output: 0.024 },
  'mistral-medium-latest': { input: 0.0025, output: 0.0075 },
  'mistral-medium-2312': { input: 0.0025, output: 0.0075 },
  'mistral-small-latest': { input: 0.001, output: 0.003 },
  'mistral-small-2402': { input: 0.001, output: 0.003 },
  'mistral-tiny': { input: 0.00025, output: 0.00025 },
  'open-mistral-7b': { input: 0.00025, output: 0.00025 },
  'open-mixtral-8x7b': { input: 0.0007, output: 0.0007 },
  'open-mixtral-8x22b': { input: 0.002, output: 0.006 },
};

/**
 * Fonctionnalités spéciales par modèle
 */
export const MODEL_FEATURES: Record<string, string[]> = {
  // OpenAI
  'gpt-4-turbo-preview': ['json-mode', 'function-calling', 'vision'],
  'gpt-4': ['json-mode', 'function-calling'],
  'gpt-4-32k': ['json-mode', 'function-calling'],
  'gpt-3.5-turbo': ['json-mode', 'function-calling'],
  'gpt-3.5-turbo-16k': ['json-mode', 'function-calling'],
  
  // Mistral
  'mistral-large-latest': ['json-mode', 'function-calling', 'safe-prompt'],
  'mistral-large-2402': ['json-mode', 'function-calling', 'safe-prompt'],
  'mistral-medium-latest': ['json-mode', 'safe-prompt'],
  'mistral-medium-2312': ['json-mode', 'safe-prompt'],
  'mistral-small-latest': ['json-mode', 'safe-prompt'],
  'mistral-small-2402': ['json-mode', 'safe-prompt'],
  'mistral-tiny': ['safe-prompt'],
  'open-mistral-7b': ['safe-prompt'],
  'open-mixtral-8x7b': ['safe-prompt'],
  'open-mixtral-8x22b': ['safe-prompt'],
};

/**
 * Valide une configuration IA
 */
export function validateAIConfig(config: AIConfig): string[] {
  const errors: string[] = [];
  
  if (!config.provider) {
    errors.push('Provider IA requis');
  }
  
  if (!config.apiKey) {
    errors.push('Clé API requise');
  }
  
  if (!config.model) {
    errors.push('Modèle requis');
  }
  
  if (config.provider === 'azure-openai' && !config.endpoint) {
    errors.push('Endpoint Azure OpenAI requis');
  }
  
  if (config.provider && config.model) {
    const availableModels = AVAILABLE_MODELS[config.provider];
    if (availableModels && !availableModels.includes(config.model)) {
      errors.push(`Modèle ${config.model} non disponible pour ${config.provider}`);
    }
  }
  
  if (config.temperature < 0 || config.temperature > 2) {
    errors.push('Temperature doit être entre 0 et 2');
  }
  
  if (config.maxTokens < 1 || config.maxTokens > 32768) {
    errors.push('MaxTokens doit être entre 1 et 32768');
  }
  
  if (config.topP < 0 || config.topP > 1) {
    errors.push('TopP doit être entre 0 et 1');
  }
  
  return errors;
}

/**
 * Crée une configuration IA avec des valeurs par défaut
 */
export function createAIConfig(
  provider: 'openai' | 'azure-openai' | 'mistral',
  apiKey: string,
  overrides: Partial<AIConfig> = {}
): AIConfig {
  const defaultConfig = DEFAULT_AI_CONFIGS[provider];
  
  return {
    provider,
    apiKey,
    ...defaultConfig,
    ...overrides,
  } as AIConfig;
}

/**
 * Estime le coût d'une requête
 */
export function estimateRequestCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model];
  if (!costs) return 0;
  
  return (inputTokens / 1000) * costs.input + (outputTokens / 1000) * costs.output;
}

/**
 * Vérifie si un modèle supporte une fonctionnalité
 */
export function supportsFeature(model: string, feature: string): boolean {
  const features = MODEL_FEATURES[model];
  return features ? features.includes(feature) : false;
}

/**
 * Obtient la limite de tokens pour un modèle
 */
export function getTokenLimit(model: string): number {
  return MODEL_TOKEN_LIMITS[model] || 4096;
}

/**
 * Recommande un modèle basé sur les exigences
 */
export function recommendModel(
  provider: 'openai' | 'azure-openai' | 'mistral',
  requirements: {
    maxTokens?: number;
    maxCost?: number;
    features?: string[];
    quality?: 'basic' | 'good' | 'excellent';
  }
): string {
  const availableModels = AVAILABLE_MODELS[provider];
  if (!availableModels) return '';
  
  let candidates = availableModels;
  
  // Filtrer par limite de tokens
  if (requirements.maxTokens) {
    candidates = candidates.filter(model => 
      getTokenLimit(model) >= requirements.maxTokens!
    );
  }
  
  // Filtrer par fonctionnalités
  if (requirements.features) {
    candidates = candidates.filter(model =>
      requirements.features!.every(feature => supportsFeature(model, feature))
    );
  }
  
  // Filtrer par coût
  if (requirements.maxCost) {
    candidates = candidates.filter(model => {
      const costs = MODEL_COSTS[model];
      return costs && costs.input <= requirements.maxCost!;
    });
  }
  
  // Sélectionner par qualité
  if (requirements.quality === 'excellent') {
    const excellentModels = candidates.filter(model => 
      model.includes('large') || model.includes('4')
    );
    if (excellentModels.length > 0) return excellentModels[0];
  } else if (requirements.quality === 'good') {
    const goodModels = candidates.filter(model => 
      model.includes('medium') || model.includes('3.5')
    );
    if (goodModels.length > 0) return goodModels[0];
  }
  
  return candidates[0] || availableModels[0];
}
