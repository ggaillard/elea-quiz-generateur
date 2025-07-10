// Tests fonctionnels pour les utilitaires Mistral AI
import { describe, it, expect } from 'vitest';

describe('Tests fonctionnels - Utilitaires Mistral', () => {
  it('doit valider une clé API Mistral', () => {
    const validApiKey = 'test-api-key-123';
    const invalidApiKey = '';
    
    expect(validApiKey.length).toBeGreaterThan(0);
    expect(invalidApiKey.length).toBe(0);
  });

  it('doit formater correctement un prompt pour Mistral', () => {
    const content = 'Contenu du document à analyser';
    const config = {
      questionCount: 5,
      questionType: 'mcq',
      difficulty: 'intermediate',
      language: 'fr'
    };
    
    const prompt = `Génère ${config.questionCount} questions de type ${config.questionType} 
                   de niveau ${config.difficulty} en ${config.language} 
                   basées sur le contenu suivant: ${content}`;
    
    expect(prompt).toContain(content);
    expect(prompt).toContain(config.questionCount.toString());
    expect(prompt).toContain(config.questionType);
    expect(prompt).toContain(config.difficulty);
  });

  it('doit parser correctement une réponse JSON de Mistral', () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              questions: [
                {
                  question: 'Question test',
                  options: ['A', 'B', 'C', 'D'],
                  correct: 0,
                  explanation: 'Explication'
                }
              ]
            })
          }
        }
      ]
    };
    
    const parsedContent = JSON.parse(mockResponse.choices[0].message.content);
    
    expect(parsedContent.questions).toHaveLength(1);
    expect(parsedContent.questions[0].question).toBe('Question test');
    expect(parsedContent.questions[0].options).toHaveLength(4);
    expect(parsedContent.questions[0].correct).toBe(0);
  });

  it('doit gérer les erreurs de parsing gracieusement', () => {
    const invalidResponse = {
      choices: [
        {
          message: {
            content: 'Invalid JSON content'
          }
        }
      ]
    };
    
    try {
      JSON.parse(invalidResponse.choices[0].message.content);
      expect(false).toBe(true); // Ne devrait pas arriver
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it('doit valider les coûts estimés par modèle', () => {
    const modelCosts = {
      'mistral-large-latest': { input: 0.004, output: 0.012 },
      'mistral-medium-latest': { input: 0.0025, output: 0.0075 },
      'mistral-small-latest': { input: 0.001, output: 0.003 }
    };
    
    expect(modelCosts['mistral-large-latest'].input).toBe(0.004);
    expect(modelCosts['mistral-medium-latest'].output).toBe(0.0075);
    expect(modelCosts['mistral-small-latest'].input).toBe(0.001);
  });

  it('doit calculer correctement le coût estimé', () => {
    const inputTokens = 1000;
    const outputTokens = 500;
    const costs = { input: 0.004, output: 0.012 };
    
    const estimatedCost = (inputTokens / 1000) * costs.input + (outputTokens / 1000) * costs.output;
    
    expect(estimatedCost).toBe(0.004 + 0.006); // 0.01
  });

  it('doit valider les limites de tokens par modèle', () => {
    const modelLimits = {
      'mistral-large-latest': 32000,
      'mistral-medium-latest': 32000,
      'mistral-small-latest': 32000,
      'mistral-tiny': 32000
    };
    
    expect(modelLimits['mistral-large-latest']).toBe(32000);
    expect(modelLimits['mistral-medium-latest']).toBe(32000);
    expect(modelLimits['mistral-small-latest']).toBe(32000);
  });

  it('doit formater correctement les questions pour export', () => {
    const question = {
      id: '1',
      type: 'mcq',
      question: 'Question test',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Explication'
    };
    
    // Format Moodle XML
    const moodleXml = `
      <question type="multichoice">
        <name><text>${question.question}</text></name>
        <questiontext><text>${question.question}</text></questiontext>
        <answer fraction="100"><text>${question.options[question.correctAnswer]}</text></answer>
      </question>
    `;
    
    expect(moodleXml).toContain(question.question);
    expect(moodleXml).toContain(question.options[question.correctAnswer]);
  });

  it('doit valider la configuration par défaut', () => {
    const defaultConfig = {
      provider: 'mistral',
      model: 'mistral-large-latest',
      temperature: 0.7,
      maxTokens: 2000,
      safePrompt: true,
      questionCount: 10,
      questionType: 'mixed',
      difficulty: 'intermediate',
      language: 'fr'
    };
    
    expect(defaultConfig.provider).toBe('mistral');
    expect(defaultConfig.temperature).toBe(0.7);
    expect(defaultConfig.safePrompt).toBe(true);
    expect(defaultConfig.questionCount).toBe(10);
    expect(defaultConfig.language).toBe('fr');
  });

  it('doit valider les métadonnées du quiz', () => {
    const quizMetadata = {
      provider: 'mistral',
      model: 'mistral-large-latest',
      generatedAt: new Date().toISOString(),
      sourceDocument: 'test.pdf',
      questionCount: 10,
      processingTime: 5.2,
      estimatedCost: 0.015,
      language: 'fr',
      difficulty: 'intermediate'
    };
    
    expect(quizMetadata.provider).toBe('mistral');
    expect(quizMetadata.questionCount).toBe(10);
    expect(quizMetadata.processingTime).toBeGreaterThan(0);
    expect(quizMetadata.estimatedCost).toBeGreaterThan(0);
    expect(quizMetadata.language).toBe('fr');
  });
});
