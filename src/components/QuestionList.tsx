import * as React from 'react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { QuestionUnion, QuestionType } from '../types';
import { createEmptyQuestion, formatDate, validateQuestion } from '../utils';

export function QuestionList() {
  const { state, addQuestion, deleteQuestion, selectQuestion } = useQuiz();
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const handleAddQuestion = async (type: QuestionType) => {
    const newQuestion = createEmptyQuestion(type);
    await addQuestion(newQuestion);
    selectQuestion(newQuestion.id);
    setShowAddDropdown(false);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      await deleteQuestion(questionId);
    }
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    switch (type) {
      case 'mcq':
        return 'QCM';
      case 'truefalse':
        return 'Vrai/Faux';
      case 'shortanswer':
        return 'Réponse courte';
      case 'matching':
        return 'Appariement';
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: QuestionType): string => {
    switch (type) {
      case 'mcq':
        return 'bg-blue-100 text-blue-800';
      case 'truefalse':
        return 'bg-green-100 text-green-800';
      case 'shortanswer':
        return 'bg-yellow-100 text-yellow-800';
      case 'matching':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidationIcon = (question: QuestionUnion) => {
    const errors = validateQuestion(question);
    const hasErrors = errors.some(e => e.severity === 'error');
    const hasWarnings = errors.some(e => e.severity === 'warning');

    if (hasErrors) {
      return <div title="Erreurs de validation"><XCircle size={16} className="text-red-500" /></div>;
    } else if (hasWarnings) {
      return <div title="Avertissements"><AlertCircle size={16} className="text-yellow-500" /></div>;
    } else {
      return <div title="Question valide"><CheckCircle size={16} className="text-green-500" /></div>;
    }
  };

  if (!state.currentQuiz) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Sélectionnez un quiz pour voir ses questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Questions ({state.currentQuiz.questions.length})
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span className="ml-2">Ajouter une question</span>
            </button>
            
            {showAddDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleAddQuestion('mcq')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    QCM (Choix multiple)
                  </button>
                  <button
                    onClick={() => handleAddQuestion('truefalse')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Vrai/Faux
                  </button>
                  <button
                    onClick={() => handleAddQuestion('shortanswer')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Réponse courte
                  </button>
                  <button
                    onClick={() => handleAddQuestion('matching')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Appariement
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {state.currentQuiz.questions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-gray-500">
              <Plus size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Aucune question</p>
              <p className="text-sm">Commencez par ajouter une question à votre quiz</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {state.currentQuiz.questions.map((question, index) => (
              <div
                key={question.id}
                className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  state.selectedQuestionId === question.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectQuestion(question.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className={`badge ${getQuestionTypeColor(question.type)}`}>
                        {getQuestionTypeLabel(question.type)}
                      </span>
                      {getValidationIcon(question)}
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {question.title || 'Sans titre'}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {question.text || 'Pas de texte'}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>Note: {question.defaultGrade}</span>
                      <span>Pénalité: {question.penalty}%</span>
                      <span>Modifiée: {formatDate(question.modified)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectQuestion(question.id);
                      }}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement duplicate question
                      }}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      title="Dupliquer"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuestion(question.id);
                      }}
                      className="p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
