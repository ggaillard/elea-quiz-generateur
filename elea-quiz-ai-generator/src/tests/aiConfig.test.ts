import { describe, it, expect } from 'vitest';
import { 
  createAIConfig, 
  validateAIConfig, 
  getMistralRecommendations,
  getProviderCost,
  getSupportedModels 
} from '../utils/aiConfig';
import { AIProvider } from '../types';

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
      const config = createAIConfig('azure', 'test-key', {
        endpoint: 'https://test.openai.azure.com',
        model: 'gpt-4',
        deploymentName: 'gpt-4-deployment'
      });
      
      expect(config.provider).toBe('azure');
      expect(config.apiKey).toBe('test-key');
      expect(config.endpoint).toBe('https://test.openai.azure.com');
      expect(config.deploymentName).toBe('gpt-4-deployment');
    });
  });

  describe('validateAIConfig', () => {
    it('devrait valider une configuration Mistral valide', () => {
      const config = {
        provider: 'mistral' as AIProvider,
        apiKey: 'test-key',
        model: 'mistral-large-latest'
      };
      
      const result = validateAIConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait détecter une clé API manquante', () => {
      const config = {
        provider: 'mistral' as AIProvider,
        apiKey: '',
        model: 'mistral-large-latest'
      };
      
      const result = validateAIConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Clé API manquante');
    });

    it('devrait détecter un modèle non supporté', () => {
      const config = {
        provider: 'mistral' as AIProvider,
        apiKey: 'test-key',
        model: 'invalid-model'
      };
      
      const result = validateAIConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Modèle non supporté pour Mistral');
    });

    it('devrait détecter un endpoint Azure manquant', () => {
      const config = {
        provider: 'azure' as AIProvider,
        apiKey: 'test-key',
        model: 'gpt-4'
        // endpoint manquant
      };
      
      const result = validateAIConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Endpoint Azure manquant');
    });
  });

  describe('getMistralRecommendations', () => {
    it('devrait recommander mistral-large-latest pour une utilisation avancée', () => {
      const recommendations = getMistralRecommendations('advanced', 'high');
      expect(recommendations.model).toBe('mistral-large-latest');
      expect(recommendations.safePrompt).toBe(true);
    });

    it('devrait recommander mistral-medium-latest pour une utilisation équilibrée', () => {
      const recommendations = getMistralRecommendations('intermediate', 'medium');
      expect(recommendations.model).toBe('mistral-medium-latest');
      expect(recommendations.temperature).toBe(0.7);
    });

    it('devrait recommander mistral-small-latest pour une utilisation économique', () => {
      const recommendations = getMistralRecommendations('beginner', 'low');
      expect(recommendations.model).toBe('mistral-small-latest');
      expect(recommendations.temperature).toBe(0.5);
    });
  });

  describe('getProviderCost', () => {
    it('devrait retourner le coût estimé pour Mistral', () => {
      const cost = getProviderCost('mistral', 'mistral-large-latest', 1000);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('devrait retourner le coût estimé pour OpenAI', () => {
      const cost = getProviderCost('openai', 'gpt-4', 1000);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('devrait retourner 0 pour un provider inconnu', () => {
      const cost = getProviderCost('unknown' as AIProvider, 'unknown-model', 1000);
      expect(cost).toBe(0);
    });
  });

  describe('getSupportedModels', () => {
    it('devrait retourner les modèles supportés pour Mistral', () => {
      const models = getSupportedModels('mistral');
      expect(models).toContain('mistral-large-latest');
      expect(models).toContain('mistral-medium-latest');
      expect(models).toContain('mistral-small-latest');
      expect(models.length).toBeGreaterThan(0);
    });

    it('devrait retourner les modèles supportés pour OpenAI', () => {
      const models = getSupportedModels('openai');
      expect(models).toContain('gpt-4');
      expect(models).toContain('gpt-3.5-turbo');
      expect(models.length).toBeGreaterThan(0);
    });

    it('devrait retourner une liste vide pour un provider inconnu', () => {
      const models = getSupportedModels('unknown' as AIProvider);
      expect(models).toEqual([]);
    });
  });
});
