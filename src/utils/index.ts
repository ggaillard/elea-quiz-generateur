import { QuestionUnion, ValidationError, QuestionType, McqQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchingQuestion } from '../types';

/**
 * Génère un ID unique basé sur la date et un nombre aléatoire
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Valide une question selon son type
 */
export function validateQuestion(question: QuestionUnion): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validation générale
  if (!question.title.trim()) {
    errors.push({
      field: 'title',
      message: 'Le titre de la question est obligatoire',
      severity: 'error'
    });
  }

  if (!question.text.trim()) {
    errors.push({
      field: 'text',
      message: 'Le texte de la question est obligatoire',
      severity: 'error'
    });
  }

  if (question.defaultGrade <= 0) {
    errors.push({
      field: 'defaultGrade',
      message: 'La note par défaut doit être supérieure à 0',
      severity: 'error'
    });
  }

  if (question.penalty < 0 || question.penalty > 100) {
    errors.push({
      field: 'penalty',
      message: 'La pénalité doit être comprise entre 0 et 100%',
      severity: 'error'
    });
  }

  // Validation spécifique par type
  switch (question.type) {
    case 'mcq':
      errors.push(...validateMcqQuestion(question as McqQuestion));
      break;
    case 'truefalse':
      errors.push(...validateTrueFalseQuestion(question as TrueFalseQuestion));
      break;
    case 'shortanswer':
      errors.push(...validateShortAnswerQuestion(question as ShortAnswerQuestion));
      break;
    case 'matching':
      errors.push(...validateMatchingQuestion(question as MatchingQuestion));
      break;
  }

  return errors;
}

function validateMcqQuestion(question: McqQuestion): ValidationError[] {
  const errors: ValidationError[] = [];

  if (question.answers.length < 2) {
    errors.push({
      field: 'answers',
      message: 'Une question QCM doit avoir au moins 2 réponses',
      severity: 'error'
    });
  }

  if (question.answers.length > 10) {
    errors.push({
      field: 'answers',
      message: 'Une question QCM ne peut avoir plus de 10 réponses',
      severity: 'warning'
    });
  }

  const totalFraction = question.answers.reduce((sum, answer) => sum + answer.fraction, 0);
  
  if (question.single && totalFraction !== 100) {
    errors.push({
      field: 'answers',
      message: 'Pour un choix unique, la somme des fractions doit être égale à 100%',
      severity: 'error'
    });
  }

  if (!question.single && totalFraction > 100) {
    errors.push({
      field: 'answers',
      message: 'Pour un choix multiple, la somme des fractions ne peut dépasser 100%',
      severity: 'error'
    });
  }

  question.answers.forEach((answer, index) => {
    if (!answer.text.trim()) {
      errors.push({
        field: `answers[${index}].text`,
        message: `Le texte de la réponse ${index + 1} est obligatoire`,
        severity: 'error'
      });
    }

    if (answer.fraction < 0 || answer.fraction > 100) {
      errors.push({
        field: `answers[${index}].fraction`,
        message: `La fraction de la réponse ${index + 1} doit être comprise entre 0 et 100%`,
        severity: 'error'
      });
    }
  });

  return errors;
}

function validateTrueFalseQuestion(question: TrueFalseQuestion): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Pas de validation spécifique pour Vrai/Faux
  return errors;
}

function validateShortAnswerQuestion(question: ShortAnswerQuestion): ValidationError[] {
  const errors: ValidationError[] = [];

  if (question.answers.length === 0) {
    errors.push({
      field: 'answers',
      message: 'Une question à réponse courte doit avoir au moins une réponse',
      severity: 'error'
    });
  }

  if (question.answers.length > 5) {
    errors.push({
      field: 'answers',
      message: 'Une question à réponse courte ne peut avoir plus de 5 réponses',
      severity: 'warning'
    });
  }

  question.answers.forEach((answer, index) => {
    if (!answer.text.trim()) {
      errors.push({
        field: `answers[${index}].text`,
        message: `Le texte de la réponse ${index + 1} est obligatoire`,
        severity: 'error'
      });
    }

    if (answer.fraction < 0 || answer.fraction > 100) {
      errors.push({
        field: `answers[${index}].fraction`,
        message: `La fraction de la réponse ${index + 1} doit être comprise entre 0 et 100%`,
        severity: 'error'
      });
    }
  });

  return errors;
}

function validateMatchingQuestion(question: MatchingQuestion): ValidationError[] {
  const errors: ValidationError[] = [];

  if (question.subquestions.length < 2) {
    errors.push({
      field: 'subquestions',
      message: 'Une question d\'appariement doit avoir au moins 2 paires',
      severity: 'error'
    });
  }

  question.subquestions.forEach((subquestion, index) => {
    if (!subquestion.text.trim()) {
      errors.push({
        field: `subquestions[${index}].text`,
        message: `Le texte de la question ${index + 1} est obligatoire`,
        severity: 'error'
      });
    }

    if (!subquestion.answerText.trim()) {
      errors.push({
        field: `subquestions[${index}].answerText`,
        message: `Le texte de la réponse ${index + 1} est obligatoire`,
        severity: 'error'
      });
    }
  });

  return errors;
}

/**
 * Crée une question vide selon le type spécifié
 */
export function createEmptyQuestion(type: QuestionType): QuestionUnion {
  const baseQuestion = {
    id: generateId(),
    title: '',
    text: '',
    defaultGrade: 1,
    penalty: 0,
    generalFeedback: '',
    tags: [],
    created: new Date(),
    modified: new Date()
  };

  switch (type) {
    case 'mcq':
      return {
        ...baseQuestion,
        type: 'mcq',
        single: true,
        shuffleAnswers: false,
        answers: [
          { id: generateId(), text: '', fraction: 100, feedback: '' },
          { id: generateId(), text: '', fraction: 0, feedback: '' }
        ],
        correctFeedback: '',
        partiallyCorrectFeedback: '',
        incorrectFeedback: ''
      } as McqQuestion;

    case 'truefalse':
      return {
        ...baseQuestion,
        type: 'truefalse',
        correctAnswer: true,
        trueFeedback: '',
        falseFeedback: ''
      } as TrueFalseQuestion;

    case 'shortanswer':
      return {
        ...baseQuestion,
        type: 'shortanswer',
        caseSensitive: false,
        useCase: false,
        answers: [
          { id: generateId(), text: '', fraction: 100, feedback: '' }
        ]
      } as ShortAnswerQuestion;

    case 'matching':
      return {
        ...baseQuestion,
        type: 'matching',
        shuffleAnswers: false,
        subquestions: [
          { id: generateId(), text: '', answerText: '' },
          { id: generateId(), text: '', answerText: '' }
        ]
      } as MatchingQuestion;
  }
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Échappe le HTML dans une chaîne
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Décode les entités HTML
 */
export function unescapeHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * Télécharge un fichier côté client
 */
export function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lit un fichier uploadé
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Impossible de lire le fichier'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsText(file);
  });
}

/**
 * Debounce une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone d'un objet
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}
