import * as Papa from 'papaparse';
import { QuestionUnion, McqQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchingQuestion, CsvTemplate, ImportResult, ValidationError, Quiz } from '../types';
import { generateId, validateQuestion } from '../utils';

export class CsvParserService {
  /**
   * Génère un template CSV pour l'import
   */
  static getCsvTemplate(): CsvTemplate {
    return {
      headers: [
        'Type',
        'Titre',
        'Question',
        'Note',
        'Pénalité',
        'Feedback général',
        'Tags',
        'Réponse 1',
        'Fraction 1',
        'Feedback 1',
        'Réponse 2',
        'Fraction 2',
        'Feedback 2',
        'Réponse 3',
        'Fraction 3',
        'Feedback 3',
        'Réponse 4',
        'Fraction 4',
        'Feedback 4',
        'Réponse 5',
        'Fraction 5',
        'Feedback 5',
        'Options spéciales'
      ],
      sampleData: [
        {
          'Type': 'mcq',
          'Titre': 'Capitale de la France',
          'Question': 'Quelle est la capitale de la France ?',
          'Note': '1',
          'Pénalité': '0',
          'Feedback général': 'Paris est la capitale et la plus grande ville de France.',
          'Tags': 'géographie,france',
          'Réponse 1': 'Paris',
          'Fraction 1': '100',
          'Feedback 1': 'Correct !',
          'Réponse 2': 'Lyon',
          'Fraction 2': '0',
          'Feedback 2': 'Non, Lyon est la troisième ville de France.',
          'Réponse 3': 'Marseille',
          'Fraction 3': '0',
          'Feedback 3': 'Non, Marseille est la deuxième ville de France.',
          'Réponse 4': 'Toulouse',
          'Fraction 4': '0',
          'Feedback 4': 'Non, Toulouse est la quatrième ville de France.',
          'Réponse 5': '',
          'Fraction 5': '',
          'Feedback 5': '',
          'Options spéciales': 'single=true;shuffle=false'
        },
        {
          'Type': 'truefalse',
          'Titre': 'Population française',
          'Question': 'La France compte plus de 70 millions d\'habitants.',
          'Note': '1',
          'Pénalité': '0',
          'Feedback général': 'La France compte environ 67 millions d\'habitants.',
          'Tags': 'géographie,démographie',
          'Réponse 1': 'Vrai',
          'Fraction 1': '0',
          'Feedback 1': 'Faux, la France compte environ 67 millions d\'habitants.',
          'Réponse 2': 'Faux',
          'Fraction 2': '100',
          'Feedback 2': 'Correct !',
          'Réponse 3': '',
          'Fraction 3': '',
          'Feedback 3': '',
          'Réponse 4': '',
          'Fraction 4': '',
          'Feedback 4': '',
          'Réponse 5': '',
          'Fraction 5': '',
          'Feedback 5': '',
          'Options spéciales': ''
        }
      ],
      instructions: `
Instructions pour l'import CSV :

1. TYPES DE QUESTIONS SUPPORTÉS :
   - mcq : Questions à choix multiples
   - truefalse : Questions Vrai/Faux
   - shortanswer : Questions à réponse courte
   - matching : Questions d'appariement

2. COLONNES OBLIGATOIRES :
   - Type : Type de question (mcq, truefalse, shortanswer, matching)
   - Titre : Titre de la question
   - Question : Texte de la question
   - Note : Note par défaut (nombre positif)

3. COLONNES OPTIONNELLES :
   - Pénalité : Pénalité en pourcentage (0-100)
   - Feedback général : Feedback général pour la question
   - Tags : Tags séparés par des virgules
   - Réponse 1-5 : Textes des réponses
   - Fraction 1-5 : Pourcentages des réponses (0-100)
   - Feedback 1-5 : Feedbacks des réponses
   - Options spéciales : Options spécifiques au type de question

4. OPTIONS SPÉCIALES :
   Pour QCM : single=true/false;shuffle=true/false
   Pour Réponse courte : caseSensitive=true/false
   Pour Appariement : shuffle=true/false
   Séparer par des points-virgules

5. RÈGLES IMPORTANTES :
   - Encodage UTF-8 requis
   - Utiliser des guillemets pour les textes contenant des virgules
   - Pour les questions d'appariement, utiliser le format "Question:Réponse"
   - La somme des fractions doit être cohérente selon le type de question

6. EXEMPLE D'APPARIEMENT :
   Type: matching
   Réponse 1: "Paris:France"
   Réponse 2: "Londres:Angleterre"
   Réponse 3: "Rome:Italie"
      `
    };
  }

  /**
   * Génère le CSV pour l'export
   */
  static generateCsv(questions: QuestionUnion[]): string {
    const data = questions.map(question => this.questionToCsvRow(question));
    return Papa.unparse(data, {
      header: true,
      delimiter: ','
    });
  }

  /**
   * Parse le CSV et retourne les questions
   */
  static async parseCsv(csvContent: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      questions: [],
      errors: [],
      warnings: []
    };

    try {
      const parseResult = Papa.parse<Record<string, string>>(csvContent, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      if (parseResult.errors.length > 0) {
        result.errors = parseResult.errors.map(error => ({
          field: 'csv',
          message: error.message,
          severity: 'error' as const
        }));
        return result;
      }

      const questions: QuestionUnion[] = [];

      for (let i = 0; i < parseResult.data.length; i++) {
        const row = parseResult.data[i];
        const rowNumber = i + 2; // +2 car ligne 1 = headers, et index commence à 0

        try {
          const question = this.csvRowToQuestion(row);
          const validationErrors = validateQuestion(question);
          
          if (validationErrors.some(e => e.severity === 'error')) {
            result.errors.push(...validationErrors.map(e => ({
              ...e,
              field: `Ligne ${rowNumber}, ${e.field}`,
              message: e.message
            })));
          } else {
            questions.push(question);
            result.warnings.push(...validationErrors.map(e => ({
              ...e,
              field: `Ligne ${rowNumber}, ${e.field}`,
              message: e.message
            })));
          }
        } catch (error) {
          result.errors.push({
            field: `Ligne ${rowNumber}`,
            message: error instanceof Error ? error.message : 'Erreur inconnue',
            severity: 'error'
          });
        }
      }

      result.questions = questions;
      result.success = result.errors.length === 0;

    } catch (error) {
      result.errors.push({
        field: 'csv',
        message: error instanceof Error ? error.message : 'Erreur lors du parsing CSV',
        severity: 'error'
      });
    }

    return result;
  }

  /**
   * Convertit une question en ligne CSV
   */
  private static questionToCsvRow(question: QuestionUnion): Record<string, string> {
    const baseRow: Record<string, string> = {
      'Type': question.type,
      'Titre': question.title,
      'Question': question.text,
      'Note': question.defaultGrade.toString(),
      'Pénalité': question.penalty.toString(),
      'Feedback général': question.generalFeedback || '',
      'Tags': question.tags?.join(',') || ''
    };

    // Réinitialiser les colonnes de réponses
    for (let i = 1; i <= 5; i++) {
      baseRow[`Réponse ${i}`] = '';
      baseRow[`Fraction ${i}`] = '';
      baseRow[`Feedback ${i}`] = '';
    }

    switch (question.type) {
      case 'mcq':
        const mcq = question as McqQuestion;
        mcq.answers.forEach((answer, index) => {
          if (index < 5) {
            baseRow[`Réponse ${index + 1}`] = answer.text;
            baseRow[`Fraction ${index + 1}`] = answer.fraction.toString();
            baseRow[`Feedback ${index + 1}`] = answer.feedback || '';
          }
        });
        baseRow['Options spéciales'] = `single=${mcq.single};shuffle=${mcq.shuffleAnswers}`;
        break;

      case 'truefalse':
        const tf = question as TrueFalseQuestion;
        baseRow['Réponse 1'] = 'Vrai';
        baseRow['Fraction 1'] = tf.correctAnswer ? '100' : '0';
        baseRow['Feedback 1'] = tf.trueFeedback || '';
        baseRow['Réponse 2'] = 'Faux';
        baseRow['Fraction 2'] = tf.correctAnswer ? '0' : '100';
        baseRow['Feedback 2'] = tf.falseFeedback || '';
        break;

      case 'shortanswer':
        const sa = question as ShortAnswerQuestion;
        sa.answers.forEach((answer, index) => {
          if (index < 5) {
            baseRow[`Réponse ${index + 1}`] = answer.text;
            baseRow[`Fraction ${index + 1}`] = answer.fraction.toString();
            baseRow[`Feedback ${index + 1}`] = answer.feedback || '';
          }
        });
        baseRow['Options spéciales'] = `caseSensitive=${sa.caseSensitive}`;
        break;

      case 'matching':
        const matching = question as MatchingQuestion;
        matching.subquestions.forEach((subq, index) => {
          if (index < 5) {
            baseRow[`Réponse ${index + 1}`] = `${subq.text}:${subq.answerText}`;
            baseRow[`Fraction ${index + 1}`] = '100';
            baseRow[`Feedback ${index + 1}`] = '';
          }
        });
        baseRow['Options spéciales'] = `shuffle=${matching.shuffleAnswers}`;
        break;
    }

    return baseRow;
  }

  /**
   * Convertit une ligne CSV en question
   */
  private static csvRowToQuestion(row: Record<string, string>): QuestionUnion {
    const type = row['Type']?.toLowerCase().trim();
    if (!type) {
      throw new Error('Type de question manquant');
    }

    const baseQuestion = {
      id: generateId(),
      title: row['Titre']?.trim() || '',
      text: row['Question']?.trim() || '',
      defaultGrade: parseFloat(row['Note']) || 1,
      penalty: parseFloat(row['Pénalité']) || 0,
      generalFeedback: row['Feedback général']?.trim() || '',
      tags: row['Tags']?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      created: new Date(),
      modified: new Date()
    };

    const options = this.parseOptions(row['Options spéciales'] || '');

    switch (type) {
      case 'mcq':
        return {
          ...baseQuestion,
          type: 'mcq',
          single: options.single !== 'false',
          shuffleAnswers: options.shuffle === 'true',
          answers: this.parseAnswers(row).map(answer => ({
            id: generateId(),
            text: answer.text,
            fraction: answer.fraction,
            feedback: answer.feedback
          })),
          correctFeedback: '',
          partiallyCorrectFeedback: '',
          incorrectFeedback: ''
        } as McqQuestion;

      case 'truefalse':
        const trueFraction = parseFloat(row['Fraction 1']) || 0;
        return {
          ...baseQuestion,
          type: 'truefalse',
          correctAnswer: trueFraction > 0,
          trueFeedback: row['Feedback 1']?.trim() || '',
          falseFeedback: row['Feedback 2']?.trim() || ''
        } as TrueFalseQuestion;

      case 'shortanswer':
        return {
          ...baseQuestion,
          type: 'shortanswer',
          caseSensitive: options.caseSensitive === 'true',
          useCase: options.caseSensitive === 'true',
          answers: this.parseAnswers(row).map(answer => ({
            id: generateId(),
            text: answer.text,
            fraction: answer.fraction,
            feedback: answer.feedback
          }))
        } as ShortAnswerQuestion;

      case 'matching':
        return {
          ...baseQuestion,
          type: 'matching',
          shuffleAnswers: options.shuffle === 'true',
          subquestions: this.parseMatchingAnswers(row).map(subq => ({
            id: generateId(),
            text: subq.text,
            answerText: subq.answerText
          }))
        } as MatchingQuestion;

      default:
        throw new Error(`Type de question non supporté: ${type}`);
    }
  }

  /**
   * Parse les réponses depuis une ligne CSV
   */
  private static parseAnswers(row: Record<string, string>): Array<{ text: string; fraction: number; feedback: string }> {
    const answers: Array<{ text: string; fraction: number; feedback: string }> = [];

    for (let i = 1; i <= 5; i++) {
      const text = row[`Réponse ${i}`]?.trim();
      const fraction = parseFloat(row[`Fraction ${i}`]) || 0;
      const feedback = row[`Feedback ${i}`]?.trim() || '';

      if (text) {
        answers.push({ text, fraction, feedback });
      }
    }

    return answers;
  }

  /**
   * Parse les réponses d'appariement depuis une ligne CSV
   */
  private static parseMatchingAnswers(row: Record<string, string>): Array<{ text: string; answerText: string }> {
    const answers: Array<{ text: string; answerText: string }> = [];

    for (let i = 1; i <= 5; i++) {
      const responseText = row[`Réponse ${i}`]?.trim();
      if (responseText) {
        const parts = responseText.split(':');
        if (parts.length === 2) {
          answers.push({
            text: parts[0].trim(),
            answerText: parts[1].trim()
          });
        }
      }
    }

    return answers;
  }

  /**
   * Parse les options spéciales
   */
  private static parseOptions(optionsString: string): Record<string, string> {
    const options: Record<string, string> = {};
    
    if (!optionsString) return options;

    optionsString.split(';').forEach(option => {
      const [key, value] = option.split('=');
      if (key && value) {
        options[key.trim()] = value.trim();
      }
    });

    return options;
  }
}

/**
 * Fonction d'export pour générer du CSV depuis un quiz
 */
export function generateCSV(quiz: Quiz, settings?: any): string {
  const headers = [
    'Type',
    'Titre',
    'Question',
    'Note',
    'Pénalité',
    'Feedback général',
    'Tags',
    'Réponse 1',
    'Fraction 1',
    'Feedback 1',
    'Réponse 2',
    'Fraction 2',
    'Feedback 2',
    'Réponse 3',
    'Fraction 3',
    'Feedback 3',
    'Réponse 4',
    'Fraction 4',
    'Feedback 4',
    'Réponse 5',
    'Fraction 5',
    'Feedback 5',
    'Options spéciales'
  ];

  const rows = quiz.questions.map(question => {
    const baseData: Record<string, string> = {
      'Type': question.type,
      'Titre': question.title,
      'Question': question.text,
      'Note': question.defaultGrade?.toString() || '1',
      'Pénalité': question.penalty?.toString() || '0',
      'Feedback général': question.generalFeedback || '',
      'Tags': question.tags?.join(',') || '',
      'Options spéciales': ''
    };

    // Initialiser les colonnes de réponses
    for (let i = 1; i <= 5; i++) {
      baseData[`Réponse ${i}`] = '';
      baseData[`Fraction ${i}`] = '';
      baseData[`Feedback ${i}`] = '';
    }

    // Ajouter les réponses selon le type
    if (question.type === 'mcq') {
      const mcq = question as McqQuestion;
      mcq.answers.forEach((answer, index) => {
        if (index < 5) {
          baseData[`Réponse ${index + 1}`] = answer.text;
          baseData[`Fraction ${index + 1}`] = answer.fraction?.toString() || '0';
          baseData[`Feedback ${index + 1}`] = answer.feedback || '';
        }
      });
    } else if (question.type === 'truefalse') {
      const tf = question as TrueFalseQuestion;
      baseData['Réponse 1'] = 'Vrai';
      baseData['Fraction 1'] = tf.correctAnswer ? '100' : '0';
      baseData['Feedback 1'] = tf.trueFeedback || '';
      baseData['Réponse 2'] = 'Faux';
      baseData['Fraction 2'] = tf.correctAnswer ? '0' : '100';
      baseData['Feedback 2'] = tf.falseFeedback || '';
    } else if (question.type === 'shortanswer') {
      const sa = question as ShortAnswerQuestion;
      sa.answers.forEach((answer, index) => {
        if (index < 5) {
          baseData[`Réponse ${index + 1}`] = answer.text;
          baseData[`Fraction ${index + 1}`] = answer.fraction?.toString() || '100';
          baseData[`Feedback ${index + 1}`] = answer.feedback || '';
        }
      });
    } else if (question.type === 'matching') {
      const match = question as MatchingQuestion;
      match.subquestions.forEach((subq, index) => {
        if (index < 5) {
          baseData[`Réponse ${index + 1}`] = `${subq.text}:${subq.answerText}`;
          baseData[`Fraction ${index + 1}`] = '100';
          baseData[`Feedback ${index + 1}`] = '';
        }
      });
    }

    return baseData;
  });

  return Papa.unparse({
    fields: headers,
    data: rows
  });
}
