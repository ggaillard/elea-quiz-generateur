import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIService } from '../services/aiService';

// Mock des modules externes
vi.mock('@mistralai/mistralai', () => ({
  MistralAI: vi.fn().mockImplementation(() => ({
    chat: vi.fn()
  }))
}));

vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }))
}));

vi.mock('@azure/openai', () => ({
  OpenAIClient: vi.fn().mockImplementation(() => ({
    getChatCompletions: vi.fn()
  }))
}));

describe('AIService - Intégration Mistral AI', () => {
  let aiService: AIService;
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialisation du service', () => {
    it('devrait initialiser correctement le service pour Mistral', () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      expect(aiService).toBeDefined();
      expect(aiService.config.provider).toBe('mistral');
    });

    it('devrait initialiser correctement le service pour OpenAI', () => {
      const config = {
        provider: 'openai' as const,
        apiKey: 'test-key',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      expect(aiService).toBeDefined();
      expect(aiService.config.provider).toBe('openai');
    });

    it('devrait initialiser correctement le service pour Azure OpenAI', () => {
      const config = {
        provider: 'azure-openai' as const,
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      expect(aiService).toBeDefined();
      expect(aiService.config.provider).toBe('azure-openai');
    });
  });

  describe('Génération de quiz avec Mistral', () => {
    it('devrait générer un quiz avec le provider Mistral', async () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      
      // Mock de la réponse Mistral
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              questions: [
                {
                  question: "Quelle est la capitale de la France ?",
                  options: ["Paris", "Lyon", "Marseille", "Toulouse"],
                  correct: 0,
                  explanation: "Paris est la capitale de la France."
                }
              ]
            })
          }
        }]
      };
      
      const mockChat = vi.fn().mockResolvedValue(mockResponse);
      // @ts-ignore
      aiService.mistralClient = { chat: mockChat };
      
      const quiz = await aiService.generateQuiz({
        content: "La France est un pays en Europe. Sa capitale est Paris.",
        type: 'mcq',
        count: 1,
        level: 'beginner'
      });
      
      expect(quiz.questions).toHaveLength(1);
      expect(quiz.questions[0].question).toBe("Quelle est la capitale de la France ?");
      expect(quiz.questions[0].options).toHaveLength(4);
      expect(quiz.questions[0].correct).toBe(0);
    });

    it('devrait gérer les erreurs lors de la génération avec Mistral', async () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      
      // Mock d'une erreur
      const mockChat = vi.fn().mockRejectedValue(new Error('API Error'));
      // @ts-ignore
      aiService.mistralClient = { chat: mockChat };
      
      await expect(aiService.generateQuiz({
        content: "Test content",
        type: 'mcq',
        count: 1,
        level: 'beginner'
      })).rejects.toThrow('API Error');
    });
  });

  describe('Validation des réponses', () => {
    it('devrait valider correctement les réponses JSON', () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      
      const validResponse = {
        questions: [
          {
            question: "Test question",
            options: ["A", "B", "C", "D"],
            correct: 0,
            explanation: "Test explanation"
          }
        ]
      };
      
      const result = aiService.validateResponse(JSON.stringify(validResponse));
      expect(result).toBe(true);
    });

    it('devrait rejeter les réponses JSON invalides', () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      
      const invalidResponse = {
        questions: [
          {
            question: "Test question",
            // options manquantes
            correct: 0,
            explanation: "Test explanation"
          }
        ]
      };
      
      const result = aiService.validateResponse(JSON.stringify(invalidResponse));
      expect(result).toBe(false);
    });
  });

  describe('Gestion des prompts sécurisés', () => {
    it('devrait utiliser safePrompt pour Mistral quand activé', async () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9,
        safePrompt: true
      };
      
      aiService = new AIService(config);
      
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              questions: [
                {
                  question: "Question test",
                  options: ["A", "B", "C", "D"],
                  correct: 0,
                  explanation: "Explication"
                }
              ]
            })
          }
        }]
      };
      
      const mockChat = vi.fn().mockResolvedValue(mockResponse);
      // @ts-ignore
      aiService.mistralClient = { chat: mockChat };
      
      await aiService.generateQuiz({
        content: "Contenu test",
        type: 'mcq',
        count: 1,
        level: 'beginner'
      });
      
      // Vérifier que safePrompt a été utilisé dans l'appel
      expect(mockChat).toHaveBeenCalledWith({
        model: 'mistral-large-latest',
        messages: expect.any(Array),
        safePrompt: true
      });
    });
  });

  describe('Gestion des erreurs réseau', () => {
    it('devrait gérer les timeouts', async () => {
      const config = {
        provider: 'mistral' as const,
        apiKey: 'test-key',
        model: 'mistral-large-latest',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9
      };
      
      aiService = new AIService(config);
      
      // Mock d'un timeout
      const mockChat = vi.fn().mockRejectedValue(new Error('timeout'));
      // @ts-ignore
      aiService.mistralClient = { chat: mockChat };
      
      await expect(aiService.generateQuiz({
        content: "Test",
        type: 'mcq',
        count: 1,
        level: 'beginner'
      })).rejects.toThrow('timeout');
    });
  });
});
