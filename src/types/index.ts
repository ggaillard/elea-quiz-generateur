export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  text: string;
  defaultGrade: number;
  penalty: number;
  generalFeedback?: string;
  tags?: string[];
  created: Date;
  modified: Date;
}

export interface McqQuestion extends Question {
  type: 'mcq';
  single: boolean; // true pour choix unique, false pour choix multiple
  shuffleAnswers: boolean;
  answers: McqAnswer[];
  correctFeedback?: string;
  partiallyCorrectFeedback?: string;
  incorrectFeedback?: string;
}

export interface TrueFalseQuestion extends Question {
  type: 'truefalse';
  correctAnswer: boolean;
  trueFeedback?: string;
  falseFeedback?: string;
}

export interface ShortAnswerQuestion extends Question {
  type: 'shortanswer';
  caseSensitive: boolean;
  answers: ShortAnswer[];
  useCase: boolean;
}

export interface MatchingQuestion extends Question {
  type: 'matching';
  shuffleAnswers: boolean;
  subquestions: MatchingSubQuestion[];
}

export interface McqAnswer {
  id: string;
  text: string;
  fraction: number; // pourcentage de points (0-100)
  feedback?: string;
}

export interface ShortAnswer {
  id: string;
  text: string;
  fraction: number;
  feedback?: string;
}

export interface MatchingSubQuestion {
  id: string;
  text: string;
  answerText: string;
}

export type QuestionType = 'mcq' | 'truefalse' | 'shortanswer' | 'matching';

export type QuestionUnion = McqQuestion | TrueFalseQuestion | ShortAnswerQuestion | MatchingQuestion;

export interface Quiz {
  id: string;
  name: string;
  description?: string;
  category: string;
  questions: QuestionUnion[];
  created: Date;
  modified: Date;
  settings: QuizSettings;
}

export interface QuizSettings {
  shuffle: boolean;
  timeLimit?: number;
  attempts?: number;
  gradingMethod: 'highest' | 'average' | 'first' | 'last';
  showFeedback: boolean;
  showCorrectAnswers: boolean;
}

export interface ExportFormat {
  type: 'xml' | 'csv' | 'json';
  options?: {
    includeImages?: boolean;
    includeFeedback?: boolean;
    category?: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportResult {
  success: boolean;
  questions: QuestionUnion[];
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface CsvRow {
  [key: string]: string;
}

export interface CsvTemplate {
  headers: string[];
  sampleData: CsvRow[];
  instructions: string;
}

export interface StorageData {
  quizzes: Quiz[];
  currentQuiz?: Quiz;
  settings: {
    language: string;
    theme: string;
    autoSave: boolean;
  };
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
