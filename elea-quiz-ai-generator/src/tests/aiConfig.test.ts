import { describe, it, expect } from 'vitest';
import { 
  createAIConfig, 
  validateAIConfig, 
  recommendModel,
  estimateRequestCost,
  supportsFeature,
  getTokenLimit,
  AVAILABLE_MODELS
} from '../utils/aiConfig';
import { AIConfig } from '../types';

describe('Configuration IA - Utilitaires', () => {
  describe('createAIConfig', () => {
    it('devrait créer une configuration valide pour Mistral', () => {
      const config = createAIConfig('mistral', 'test-key', {
        model: 'mistral-large-latest',
        temperature: 0.7,
        safePrompt: true
      });
      
      expect(config.provider).toBe('mistral');
      expect(config.apiKey).toBe('test-key');
      expect(config.model).toBe('mistral-large-latest');
      expect(config.temperature).toBe(0.7);
      expect(config.safePrompt).toBe(true);
    });

    it('devrait créer une configuration valide pour OpenAI', () => {
      const config = createAIConfig('openai', 'test-key', {
        model: 'gpt-4',
        temperature: 0.8
      });
      
      expect(config.provider).toBe('openai');
      expect(config.apiKey).toBe('test-key');
      expect(config.model).toBe('gpt-4');
      expect(config.temperature).toBe(0.8);
    });

    it('devrait créer une configuration valide pour Azure OpenAI', () => {
      const config = createAIConfig('azure-openai', 'test-key', {
        endpoint: 'https://test.openai.azure.com',
        model: 'gpt-4'
      });
      
      expect(config.provider).toBe('azure-openai');
      expect(config.apiKey).toBe('test-key');
      expect(config.endpoint).toBe('https://test.openai.azure.com');
      expect(config.model).toBe('gpt-4');
    });
  });

  describe('validateAIConfig', () => {
    it('devrait valider une configuration Mistral valide', () => {
      const config: AIConfig = {
        provider: 'mistral',
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      const errors = validateAIConfig(config);
      expect(errors).toHaveLength(0);
    });

    it('devrait détecter une clé API manquante', () => {
      const config: AIConfig = {
        provider: 'mistral',
        apiKey: '',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      const errors = validateAIConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Clé API requise');
    });

    it('devrait détecter un modèle non supporté', () => {
      const config: AIConfig = {
        provider: 'mistral',
        apiKey: 'test-key',
        model: 'invalid-model',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      const errors = validateAIConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('non disponible'))).toBe(true);
    });

    it('devrait détecter un endpoint Azure manquant', () => {
      const config: AIConfig = {
        provider: 'azure-openai',
        apiKey: 'test-key',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
        // endpoint manquant
      };
      
      const errors = validateAIConfig(config);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Endpoint Azure OpenAI requis');
    });
  });

  describe('recommendModel', () => {
    it('devrait recommander un modèle excellent pour Mistral', () => {
      const model = recommendModel('mistral', {
        quality: 'excellent',
        features: ['safe-prompt']
      });
      
      expect(model).toBe('mistral-large-latest');
    });

    it('devrait recommander un modèle good pour OpenAI', () => {
      const model = recommendModel('openai', {
        quality: 'good',
        maxCost: 0.01
      });
      
      expect(model).toBe('gpt-3.5-turbo');
    });

    it('devrait recommander un modèle basé sur les tokens', () => {
      const model = recommendModel('mistral', {
        maxTokens: 50000
      });
      
      expect(model).toBe('open-mixtral-8x22b');
    });
  });

  describe('estimateRequestCost', () => {
    it('devrait retourner le coût estimé pour Mistral', () => {
      const cost = estimateRequestCost('mistral-large-latest', 1000, 500);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('devrait retourner le coût estimé pour OpenAI', () => {
      const cost = estimateRequestCost('gpt-4', 1000, 500);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('devrait retourner 0 pour un modèle inconnu', () => {
      const cost = estimateRequestCost('unknown-model', 1000, 500);
      expect(cost).toBe(0);
    });
  });

  describe('supportsFeature', () => {
    it('devrait détecter le support de safe-prompt pour Mistral', () => {
      const supports = supportsFeature('mistral-large-latest', 'safe-prompt');
      expect(supports).toBe(true);
    });

    it('devrait détecter le support de json-mode pour OpenAI', () => {
      const supports = supportsFeature('gpt-4', 'json-mode');
      expect(supports).toBe(true);
    });

    it('devrait retourner false pour une fonctionnalité non supportée', () => {
      const supports = supportsFeature('mistral-tiny', 'json-mode');
      expect(supports).toBe(false);
    });
  });

  describe('getTokenLimit', () => {
    it('devrait retourner la limite de tokens pour Mistral', () => {
      const limit = getTokenLimit('mistral-large-latest');
      expect(limit).toBe(32768);
    });

    it('devrait retourner la limite de tokens pour OpenAI', () => {
      const limit = getTokenLimit('gpt-4');
      expect(limit).toBe(8192);
    });

    it('devrait retourner la limite par défaut pour un modèle inconnu', () => {
      const limit = getTokenLimit('unknown-model');
      expect(limit).toBe(4096);
    });
  });

  describe('AVAILABLE_MODELS', () => {
    it('devrait contenir les modèles Mistral', () => {
      const models = AVAILABLE_MODELS['mistral'];
      expect(models).toContain('mistral-large-latest');
      expect(models).toContain('mistral-medium-latest');
      expect(models).toContain('mistral-small-latest');
      expect(models.length).toBeGreaterThan(0);
    });

    it('devrait contenir les modèles OpenAI', () => {
      const models = AVAILABLE_MODELS['openai'];
      expect(models).toContain('gpt-4');
      expect(models).toContain('gpt-3.5-turbo');
      expect(models.length).toBeGreaterThan(0);
    });

    it('devrait contenir les modèles Azure OpenAI', () => {
      const models = AVAILABLE_MODELS['azure-openai'];
      expect(models).toContain('gpt-4');
      expect(models).toContain('gpt-35-turbo');
      expect(models.length).toBeGreaterThan(0);
    });
  });
});
