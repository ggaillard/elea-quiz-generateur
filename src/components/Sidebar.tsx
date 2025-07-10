import * as React from 'react';
import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  FileText, 
  List, 
  Settings, 
  Download, 
  Upload,
  Trash2,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { formatDate } from '../utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isOpen, onToggle, currentView, onViewChange }: SidebarProps) {
  const { state, createQuiz, loadQuiz, deleteQuiz } = useQuiz();
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quizName.trim()) {
      await createQuiz(quizName.trim(), quizDescription.trim() || undefined);
      setQuizName('');
      setQuizDescription('');
      setShowCreateQuiz(false);
      onViewChange('questions');
    }
  };

  const handleLoadQuiz = async (quizId: string) => {
    await loadQuiz(quizId);
    onViewChange('questions');
  };

  const handleDeleteQuiz = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      await deleteQuiz(quizId);
    }
  };

  const getStats = () => {
    const totalQuestions = state.currentQuiz?.questions.length || 0;
    const questionTypes = state.currentQuiz?.questions.reduce((types, q) => {
      types[q.type] = (types[q.type] || 0) + 1;
      return types;
    }, {} as Record<string, number>) || {};

    return { totalQuestions, questionTypes };
  };

  if (!isOpen) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Mes Quiz</h2>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Create Quiz */}
      <div className="p-4 border-b border-gray-200">
        {showCreateQuiz ? (
          <form onSubmit={handleCreateQuiz} className="space-y-3">
            <input
              type="text"
              placeholder="Nom du quiz"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="input w-full"
              autoFocus
            />
            <textarea
              placeholder="Description (optionnel)"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              className="textarea w-full"
              rows={2}
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm flex-1"
                disabled={!quizName.trim()}
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowCreateQuiz(false)}
                className="btn btn-ghost btn-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateQuiz(true)}
            className="btn btn-primary w-full"
          >
            <Plus size={16} />
            <span className="ml-2">Nouveau Quiz</span>
          </button>
        )}
      </div>

      {/* Quiz List */}
      <div className="flex-1 overflow-y-auto">
        {state.quizzes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Aucun quiz créé</p>
            <p className="text-sm">Créez votre premier quiz pour commencer</p>
          </div>
        ) : (
          <div className="p-2">
            {state.quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  state.currentQuiz?.id === quiz.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLoadQuiz(quiz.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {quiz.name}
                    </h3>
                    {quiz.description && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {quiz.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <List size={12} className="mr-1" />
                        {quiz.questions.length} questions
                      </span>
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(quiz.modified)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                    className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Quiz Stats */}
      {state.currentQuiz && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 size={16} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">Statistiques</h3>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Questions totales:</span>
              <span className="font-medium">{stats.totalQuestions}</span>
            </div>
            {Object.entries(stats.questionTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-gray-600 capitalize">{type}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
