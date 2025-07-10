import { StorageData, Quiz, QuestionUnion } from '../types';

const STORAGE_KEY = 'elea-quiz-generateur';

class StorageService {
  private data: StorageData;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): StorageData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir les dates depuis les chaînes
        return {
          ...parsed,
          quizzes: parsed.quizzes.map((quiz: any) => ({
            ...quiz,
            created: new Date(quiz.created),
            modified: new Date(quiz.modified),
            questions: quiz.questions.map((q: any) => ({
              ...q,
              created: new Date(q.created),
              modified: new Date(q.modified)
            }))
          })),
          currentQuiz: parsed.currentQuiz ? {
            ...parsed.currentQuiz,
            created: new Date(parsed.currentQuiz.created),
            modified: new Date(parsed.currentQuiz.modified),
            questions: parsed.currentQuiz.questions.map((q: any) => ({
              ...q,
              created: new Date(q.created),
              modified: new Date(q.modified)
            }))
          } : undefined
        };
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage:', error);
    }

    return {
      quizzes: [],
      settings: {
        language: 'fr',
        theme: 'light',
        autoSave: true
      }
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
      throw new Error('Impossible de sauvegarder les données');
    }
  }

  // Gestion des quiz
  getQuizzes(): Quiz[] {
    return this.data.quizzes;
  }

  getQuiz(id: string): Quiz | undefined {
    return this.data.quizzes.find(quiz => quiz.id === id);
  }

  saveQuiz(quiz: Quiz): void {
    const index = this.data.quizzes.findIndex(q => q.id === quiz.id);
    quiz.modified = new Date();
    
    if (index >= 0) {
      this.data.quizzes[index] = quiz;
    } else {
      this.data.quizzes.push(quiz);
    }
    
    this.saveToStorage();
  }

  deleteQuiz(id: string): void {
    this.data.quizzes = this.data.quizzes.filter(quiz => quiz.id !== id);
    
    if (this.data.currentQuiz?.id === id) {
      this.data.currentQuiz = undefined;
    }
    
    this.saveToStorage();
  }

  // Gestion du quiz courant
  getCurrentQuiz(): Quiz | undefined {
    return this.data.currentQuiz;
  }

  setCurrentQuiz(quiz: Quiz | undefined): void {
    this.data.currentQuiz = quiz;
    this.saveToStorage();
  }

  // Gestion des questions
  saveQuestion(quizId: string, question: QuestionUnion): void {
    const quiz = this.getQuiz(quizId);
    if (!quiz) {
      throw new Error('Quiz non trouvé');
    }

    const index = quiz.questions.findIndex(q => q.id === question.id);
    question.modified = new Date();
    
    if (index >= 0) {
      quiz.questions[index] = question;
    } else {
      quiz.questions.push(question);
    }

    this.saveQuiz(quiz);
  }

  deleteQuestion(quizId: string, questionId: string): void {
    const quiz = this.getQuiz(quizId);
    if (!quiz) {
      throw new Error('Quiz non trouvé');
    }

    quiz.questions = quiz.questions.filter(q => q.id !== questionId);
    this.saveQuiz(quiz);
  }

  // Gestion des paramètres
  getSettings() {
    return this.data.settings;
  }

  updateSettings(settings: Partial<StorageData['settings']>): void {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveToStorage();
  }

  // Backup et restore
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Validation basique
      if (!parsed.quizzes || !Array.isArray(parsed.quizzes)) {
        throw new Error('Format de données invalide');
      }

      // Convertir les dates
      const data: StorageData = {
        ...parsed,
        quizzes: parsed.quizzes.map((quiz: any) => ({
          ...quiz,
          created: new Date(quiz.created),
          modified: new Date(quiz.modified),
          questions: quiz.questions.map((q: any) => ({
            ...q,
            created: new Date(q.created),
            modified: new Date(q.modified)
          }))
        })),
        currentQuiz: parsed.currentQuiz ? {
          ...parsed.currentQuiz,
          created: new Date(parsed.currentQuiz.created),
          modified: new Date(parsed.currentQuiz.modified),
          questions: parsed.currentQuiz.questions.map((q: any) => ({
            ...q,
            created: new Date(q.created),
            modified: new Date(q.modified)
          }))
        } : undefined,
        settings: parsed.settings || this.data.settings
      };

      this.data = data;
      this.saveToStorage();
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      throw new Error('Impossible d\'importer les données');
    }
  }

  // Nettoyage
  clearAllData(): void {
    this.data = {
      quizzes: [],
      settings: {
        language: 'fr',
        theme: 'light',
        autoSave: true
      }
    };
    this.saveToStorage();
  }

  // Statistiques
  getStats() {
    const totalQuizzes = this.data.quizzes.length;
    const totalQuestions = this.data.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    const questionTypes = this.data.quizzes.reduce((types, quiz) => {
      quiz.questions.forEach(q => {
        types[q.type] = (types[q.type] || 0) + 1;
      });
      return types;
    }, {} as Record<string, number>);

    return {
      totalQuizzes,
      totalQuestions,
      questionTypes,
      storageSize: new Blob([JSON.stringify(this.data)]).size
    };
  }
}

export const storageService = new StorageService();
