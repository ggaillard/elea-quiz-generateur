import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { QuestionPreview } from './QuestionPreview';
import { QuestionUnion } from '../types';
import { Plus, Search, SortAsc, SortDesc, GripVertical } from 'lucide-react';

interface DragDropQuestionListProps {
  onAddQuestion: () => void;
  onEditQuestion: (question: QuestionUnion) => void;
}

export const DragDropQuestionList: React.FC<DragDropQuestionListProps> = ({
  onAddQuestion,
  onEditQuestion
}) => {
  const { state, updateQuestion, deleteQuestion, selectQuestion, addNotification } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const questions = state.activeQuiz?.questions || [];

  const handleDuplicateQuestion = (question: QuestionUnion) => {
    const duplicatedQuestion = {
      ...question,
      id: `${question.id}_copy_${Date.now()}`,
    };

    // Ajouter la question dupliquée
    addNotification({
      type: 'success',
      title: 'Question dupliquée',
      message: 'La question a été dupliquée avec succès'
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      deleteQuestion(questionId);
    }
  };

  const filteredQuestions = questions.filter((question: QuestionUnion) => {
    const questionTitle = (question as any).title || (question as any).name || '';
    const questionText = (question as any).text || (question as any).questionText || '';
    
    const matchesSearch = searchTerm === '' || 
      questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questionText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || question.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = (a as any).name || (a as any).title || '';
        bValue = (b as any).name || (b as any).title || '';
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'created':
        aValue = (a as any).created || 0;
        bValue = (b as any).created || 0;
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getQuestionTypeOptions = () => {
    const types = Array.from(new Set(questions.map((q: QuestionUnion) => q.type)));
    return types.map(type => ({
      value: type,
      label: type === 'mcq' ? 'QCM' : 
             type === 'truefalse' ? 'Vrai/Faux' :
             type === 'shortanswer' ? 'Réponse courte' :
             type === 'matching' ? 'Appariement' : type
    }));
  };

  if (!state.activeQuiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Aucun quiz sélectionné</p>
          <p className="text-sm text-gray-400">Sélectionnez un quiz pour voir les questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header avec recherche et filtres */}
      <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous types</option>
          {getQuestionTypeOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'created')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Nom</option>
            <option value="type">Type</option>
            <option value="created">Date</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={`Trier par ordre ${sortOrder === 'asc' ? 'décroissant' : 'croissant'}`}
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>

        <button
          onClick={onAddQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Liste des questions avec drag & drop */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' ? 'Aucune question trouvée' : 'Aucune question'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Modifiez vos critères de recherche' 
                : 'Commencez par ajouter une question'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={onAddQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter une question
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedQuestions.map((question, index) => (
              <div key={question.id} className="relative">
                <div className="flex items-center space-x-3">
                  <div className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-1">
                    <QuestionPreview
                      question={question}
                      onEdit={onEditQuestion}
                      onDuplicate={handleDuplicateQuestion}
                      onDelete={handleDeleteQuestion}
                      isSelected={state.selectedQuestionId === question.id}
                      onSelect={selectQuestion}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer avec statistiques */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {sortedQuestions.length} question{sortedQuestions.length !== 1 ? 's' : ''} affichée{sortedQuestions.length !== 1 ? 's' : ''}
            {questions.length !== sortedQuestions.length && ` sur ${questions.length}`}
          </span>
          <span>
            Quiz: {state.activeQuiz.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DragDropQuestionList;
