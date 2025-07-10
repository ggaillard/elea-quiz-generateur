import * as React from 'react';
import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Quiz, QuestionUnion, NotificationMessage } from '../types';
import { storageService } from '../services/storage';
import { generateId } from '../utils';

interface QuizContextType {
  state: QuizState;
  createQuiz: (name: string, description?: string) => Promise<void>;
  loadQuiz: (id: string) => Promise<void>;
  updateQuiz: (quiz: Quiz) => Promise<void>;
  saveCurrentQuiz: () => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  loadQuizzes: () => Promise<void>;
  addQuestion: (question: QuestionUnion) => Promise<void>;
  updateQuestion: (question: QuestionUnion) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  selectQuestion: (questionId: string | null) => void;
  addNotification: (notification: Omit<NotificationMessage, 'id'>) => void;
  removeNotification: (id: string) => void;
  exportData: () => string;
  importData: (jsonData: string) => Promise<void>;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizState {
  activeQuiz: Quiz | null;
  currentQuiz: Quiz | null;
  quizzes: Quiz[];
  selectedQuestionId: string | null;
  notifications: NotificationMessage[];
  isLoading: boolean;
  error: string | null;
}

type QuizAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_QUIZ'; payload: Quiz | null }
  | { type: 'SET_QUIZZES'; payload: Quiz[] }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'UPDATE_QUIZ'; payload: Quiz }
  | { type: 'DELETE_QUIZ'; payload: string }
  | { type: 'ADD_QUESTION'; payload: QuestionUnion }
  | { type: 'UPDATE_QUESTION'; payload: QuestionUnion }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'SET_SELECTED_QUESTION'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationMessage }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: QuizState = {
  activeQuiz: null,
  currentQuiz: null,
  quizzes: [],
  selectedQuestionId: null,
  notifications: [],
  isLoading: false,
  error: null
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CURRENT_QUIZ':
      return { ...state, currentQuiz: action.payload, activeQuiz: action.payload };

    case 'SET_QUIZZES':
      return { ...state, quizzes: action.payload };

    case 'ADD_QUIZ':
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload],
        currentQuiz: action.payload
      };

    case 'UPDATE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === action.payload.id ? action.payload : quiz
        ),
        currentQuiz: state.currentQuiz?.id === action.payload.id ? action.payload : state.currentQuiz
      };

    case 'DELETE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz.id !== action.payload),
        currentQuiz: state.currentQuiz?.id === action.payload ? null : state.currentQuiz
      };

    case 'ADD_QUESTION':
      if (!state.currentQuiz) return state;
      const updatedQuizWithNewQuestion = {
        ...state.currentQuiz,
        questions: [...state.currentQuiz.questions, action.payload],
        modified: new Date()
      };
      return {
        ...state,
        currentQuiz: updatedQuizWithNewQuestion,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === updatedQuizWithNewQuestion.id ? updatedQuizWithNewQuestion : quiz
        )
      };

    case 'UPDATE_QUESTION':
      if (!state.currentQuiz) return state;
      const updatedQuizWithUpdatedQuestion = {
        ...state.currentQuiz,
        questions: state.currentQuiz.questions.map(q =>
          q.id === action.payload.id ? action.payload : q
        ),
        modified: new Date()
      };
      return {
        ...state,
        currentQuiz: updatedQuizWithUpdatedQuestion,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === updatedQuizWithUpdatedQuestion.id ? updatedQuizWithUpdatedQuestion : quiz
        )
      };

    case 'DELETE_QUESTION':
      if (!state.currentQuiz) return state;
      const updatedQuizWithoutQuestion = {
        ...state.currentQuiz,
        questions: state.currentQuiz.questions.filter(q => q.id !== action.payload),
        modified: new Date()
      };
      return {
        ...state,
        currentQuiz: updatedQuizWithoutQuestion,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === updatedQuizWithoutQuestion.id ? updatedQuizWithoutQuestion : quiz
        ),
        selectedQuestionId: state.selectedQuestionId === action.payload ? null : state.selectedQuestionId
      };

    case 'SET_SELECTED_QUESTION':
      return { ...state, selectedQuestionId: action.payload };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  
  // Quiz actions
  createQuiz: (name: string, description?: string) => Promise<void>;
  loadQuiz: (id: string) => Promise<void>;
  updateQuiz: (quiz: Quiz) => Promise<void>;
  saveCurrentQuiz: () => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  loadQuizzes: () => Promise<void>;
  
  // Question actions
  addQuestion: (question: QuestionUnion) => Promise<void>;
  updateQuestion: (question: QuestionUnion) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  selectQuestion: (questionId: string | null) => void;
  
  // Notification actions
  addNotification: (notification: Omit<NotificationMessage, 'id'>) => void;
  removeNotification: (id: string) => void;
  
  // Data actions
  exportData: () => string;
  importData: (jsonData: string) => Promise<void>;
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load initial data
  React.useEffect(() => {
    loadQuizzes();
    const currentQuiz = storageService.getCurrentQuiz();
    if (currentQuiz) {
      dispatch({ type: 'SET_CURRENT_QUIZ', payload: currentQuiz });
    }
  }, []);

  // Auto-save current quiz
  React.useEffect(() => {
    if (state.currentQuiz) {
      storageService.setCurrentQuiz(state.currentQuiz);
    }
  }, [state.currentQuiz]);

  const createQuiz = useCallback(async (name: string, description?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newQuiz: Quiz = {
        id: generateId(),
        name,
        description,
        category: 'Default',
        questions: [],
        created: new Date(),
        modified: new Date(),
        settings: {
          shuffle: false,
          showFeedback: true,
          showCorrectAnswers: true,
          gradingMethod: 'highest'
        }
      };

      storageService.saveQuiz(newQuiz);
      dispatch({ type: 'ADD_QUIZ', payload: newQuiz });
      
      addNotification({
        type: 'success',
        title: 'Quiz créé',
        message: `Le quiz "${name}" a été créé avec succès`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: message });
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de créer le quiz: ${message}`
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadQuiz = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const quiz = storageService.getQuiz(id);
      if (!quiz) {
        throw new Error('Quiz non trouvé');
      }

      dispatch({ type: 'SET_CURRENT_QUIZ', payload: quiz });
      dispatch({ type: 'SET_SELECTED_QUESTION', payload: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: message });
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de charger le quiz: ${message}`
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateQuiz = useCallback(async (quiz: Quiz) => {
    try {
      storageService.saveQuiz(quiz);
      dispatch({ type: 'UPDATE_QUIZ', payload: quiz });
      
      addNotification({
        type: 'success',
        title: 'Quiz mis à jour',
        message: 'Le quiz a été mis à jour avec succès'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de mettre à jour le quiz: ${message}`
      });
    }
  }, []);

  const saveCurrentQuiz = useCallback(async () => {
    if (!state.currentQuiz) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      storageService.saveQuiz(state.currentQuiz);
      
      addNotification({
        type: 'success',
        title: 'Sauvegarde',
        message: 'Quiz sauvegardé avec succès'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: message });
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de sauvegarder: ${message}`
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentQuiz]);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      storageService.deleteQuiz(id);
      dispatch({ type: 'DELETE_QUIZ', payload: id });
      
      addNotification({
        type: 'success',
        title: 'Quiz supprimé',
        message: 'Le quiz a été supprimé avec succès'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: message });
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer le quiz: ${message}`
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadQuizzes = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const quizzes = storageService.getQuizzes();
      dispatch({ type: 'SET_QUIZZES', payload: quizzes });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addQuestion = useCallback(async (question: QuestionUnion) => {
    if (!state.currentQuiz) return;

    try {
      dispatch({ type: 'ADD_QUESTION', payload: question });
      storageService.saveQuestion(state.currentQuiz.id, question);
      
      addNotification({
        type: 'success',
        title: 'Question ajoutée',
        message: 'La question a été ajoutée avec succès'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible d'ajouter la question: ${message}`
      });
    }
  }, [state.currentQuiz]);

  const updateQuestion = useCallback(async (question: QuestionUnion) => {
    if (!state.currentQuiz) return;

    try {
      dispatch({ type: 'UPDATE_QUESTION', payload: question });
      storageService.saveQuestion(state.currentQuiz.id, question);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de mettre à jour la question: ${message}`
      });
    }
  }, [state.currentQuiz]);

  const deleteQuestion = useCallback(async (questionId: string) => {
    if (!state.currentQuiz) return;

    try {
      dispatch({ type: 'DELETE_QUESTION', payload: questionId });
      storageService.deleteQuestion(state.currentQuiz.id, questionId);
      
      addNotification({
        type: 'success',
        title: 'Question supprimée',
        message: 'La question a été supprimée avec succès'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer la question: ${message}`
      });
    }
  }, [state.currentQuiz]);

  const selectQuestion = useCallback((questionId: string | null) => {
    dispatch({ type: 'SET_SELECTED_QUESTION', payload: questionId });
  }, []);

  const addNotification = useCallback((notification: Omit<NotificationMessage, 'id'>) => {
    const fullNotification: NotificationMessage = {
      ...notification,
      id: generateId()
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
    
    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: fullNotification.id });
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const exportData = useCallback(() => {
    return storageService.exportData();
  }, []);

  const importData = useCallback(async (jsonData: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      storageService.importData(jsonData);
      await loadQuizzes();
      
      addNotification({
        type: 'success',
        title: 'Import réussi',
        message: 'Les données ont été importées avec succès'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      addNotification({
        type: 'error',
        title: 'Erreur d\'import',
        message: `Impossible d'importer les données: ${message}`
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <QuizContext.Provider value={{
      state,
      createQuiz,
      loadQuiz,
      updateQuiz,
      saveCurrentQuiz,
      deleteQuiz,
      loadQuizzes,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      selectQuestion,
      addNotification,
      removeNotification,
      exportData,
      importData
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
