import React, { useState, useCallback } from 'react';
import { QuestionUnion } from '../types';
import { ChevronUp, ChevronDown, GripVertical, Edit2, Trash2, Eye, EyeOff, Copy } from 'lucide-react';

interface QuestionListAdvancedProps {
  questions: QuestionUnion[];
  selectedQuestionId: string | null;
  onSelect: (questionId: string) => void;
  onUpdate: (question: QuestionUnion) => void;
  onDelete: (questionId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDuplicate: (question: QuestionUnion) => void;
}

export const QuestionListAdvanced: React.FC<QuestionListAdvancedProps> = ({
  questions,
  selectedQuestionId,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
  onDuplicate,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<{ [key: string]: boolean }>({});

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const togglePreview = useCallback((questionId: string) => {
    setPreviewMode(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, []);

  const moveQuestion = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < questions.length) {
      onReorder(index, newIndex);
    }
  }, [questions.length, onReorder]);

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq':
        return '☑️';
      case 'truefalse':
        return '✓❌';
      case 'shortanswer':
        return '✍️';
      case 'matching':
        return '🔗';
      default:
        return '❓';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
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
        return 'Question';
    }
  };

  const renderQuestionPreview = (question: QuestionUnion) => {
    const isPreview = previewMode[question.id];
    if (!isPreview) return null;

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
        <div className="prose prose-sm max-w-none">
          <div className="font-medium text-gray-900 mb-2">
            {question.text}
          </div>
          
          {question.type === 'mcq' && 'answers' in question && (
            <div className="space-y-2">
              {question.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    answer.fraction && answer.fraction > 0 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{answer.text}</span>
                  {answer.fraction && answer.fraction > 0 && (
                    <span className="text-green-600 text-sm font-medium">
                      {answer.fraction}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {question.type === 'truefalse' && 'correctAnswer' in question && (
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 p-2 rounded ${
                question.correctAnswer ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-200'
              }`}>
                <span className="w-6 h-6 flex items-center justify-center rounded-full border text-sm">✓</span>
                <span className="flex-1">Vrai</span>
                {question.correctAnswer && <span className="text-green-600 text-sm font-medium">Correct</span>}
              </div>
              <div className={`flex items-center space-x-2 p-2 rounded ${
                !question.correctAnswer ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-200'
              }`}>
                <span className="w-6 h-6 flex items-center justify-center rounded-full border text-sm">✗</span>
                <span className="flex-1">Faux</span>
                {!question.correctAnswer && <span className="text-green-600 text-sm font-medium">Correct</span>}
              </div>
            </div>
          )}

          {question.type === 'shortanswer' && 'answers' in question && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Réponses acceptées:</div>
              {question.answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-100 border border-green-200 rounded">
                  <span className="flex-1">{answer.text}</span>
                  <span className="text-green-600 text-sm font-medium">
                    {answer.fraction || 100}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {question.type === 'matching' && 'subquestions' in question && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Paires à associer:</div>
              {question.subquestions.map((subq, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <span className="flex-1">{subq.text}</span>
                  <span className="text-blue-600">↔</span>
                  <span className="flex-1">{subq.answerText}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Aucune question</h3>
          <p className="text-sm">Commencez par ajouter votre première question</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`bg-white rounded-lg border-2 transition-all ${
              selectedQuestionId === question.id
                ? 'border-blue-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              draggedIndex === index ? 'opacity-50' : ''
            } ${
              dragOverIndex === index ? 'border-blue-400 bg-blue-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                {/* Drag Handle */}
                <div className="flex flex-col items-center space-y-1 pt-1">
                  <GripVertical 
                    size={16} 
                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                  />
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === questions.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      Question {index + 1}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1">
                    {question.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {question.text}
                  </div>

                  {renderQuestionPreview(question)}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => togglePreview(question.id)}
                    className="p-2 rounded hover:bg-gray-100"
                    title={previewMode[question.id] ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}
                  >
                    {previewMode[question.id] ? (
                      <EyeOff size={16} className="text-gray-600" />
                    ) : (
                      <Eye size={16} className="text-gray-600" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => onSelect(question.id)}
                    className="p-2 rounded hover:bg-gray-100"
                    title="Modifier"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  
                  <button
                    onClick={() => onDuplicate(question)}
                    className="p-2 rounded hover:bg-gray-100"
                    title="Dupliquer"
                  >
                    <Copy size={16} className="text-green-600" />
                  </button>
                  
                  <button
                    onClick={() => onDelete(question.id)}
                    className="p-2 rounded hover:bg-gray-100"
                    title="Supprimer"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
