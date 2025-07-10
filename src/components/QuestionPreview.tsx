import React, { useState, useContext } from 'react';
import { QuizContext } from '../contexts/QuizContext';
import { QuestionUnion, McqQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchingQuestion } from '../types';
import { Eye, Edit, Copy, Trash2, GripVertical, CheckCircle, XCircle } from 'lucide-react';

interface QuestionPreviewProps {
  question: QuestionUnion;
  onEdit: (question: QuestionUnion) => void;
  onDuplicate: (question: QuestionUnion) => void;
  onDelete: (questionId: string) => void;
  isSelected: boolean;
  onSelect: (questionId: string) => void;
  isDragHandle?: boolean;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  onEdit,
  onDuplicate,
  onDelete,
  isSelected,
  onSelect,
  isDragHandle = false
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (answerId: string, value: any) => {
    setUserAnswers(prev => ({ ...prev, [answerId]: value }));
  };

  const renderQuestionPreview = () => {
    switch (question.type) {
      case 'mcq':
        return <McqPreview question={question as McqQuestion} userAnswers={userAnswers} onAnswerChange={handleAnswerChange} />;
      case 'truefalse':
        return <TrueFalsePreview question={question as TrueFalseQuestion} userAnswers={userAnswers} onAnswerChange={handleAnswerChange} />;
      case 'shortanswer':
        return <ShortAnswerPreview question={question as ShortAnswerQuestion} userAnswers={userAnswers} onAnswerChange={handleAnswerChange} />;
      case 'matching':
        return <MatchingPreview question={question as MatchingQuestion} userAnswers={userAnswers} onAnswerChange={handleAnswerChange} />;
      default:
        return <div>Type de question non supporté</div>;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'QCM';
      case 'truefalse': return 'Vrai/Faux';
      case 'shortanswer': return 'Réponse courte';
      case 'matching': return 'Appariement';
      default: return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'truefalse': return 'bg-green-100 text-green-800';
      case 'shortanswer': return 'bg-yellow-100 text-yellow-800';
      case 'matching': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {isDragHandle && (
            <div className="cursor-move text-gray-400 hover:text-gray-600 mt-1">
              <GripVertical size={16} />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getQuestionTypeColor(question.type)}`}>
                {getQuestionTypeLabel(question.type)}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {(question as any).title || (question as any).name || 'Sans titre'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {(question as any).text || (question as any).questionText || 'Pas de question'}
            </p>
            
            {showPreview && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Aperçu interactif</h4>
                {renderQuestionPreview()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Aperçu"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(question)}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
            title="Éditer"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDuplicate(question)}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
            title="Dupliquer"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composants de prévisualisation pour chaque type de question

const McqPreview: React.FC<{
  question: McqQuestion;
  userAnswers: Record<string, any>;
  onAnswerChange: (answerId: string, value: any) => void;
}> = ({ question, userAnswers, onAnswerChange }) => {
  const selectedAnswers = userAnswers[question.id] || (question.single ? '' : []);

  const handleAnswerSelect = (answerId: string) => {
    if (question.single) {
      onAnswerChange(question.id, answerId);
    } else {
      const currentAnswers = selectedAnswers || [];
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter((id: string) => id !== answerId)
        : [...currentAnswers, answerId];
      onAnswerChange(question.id, newAnswers);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        {(question as any).text || (question as any).questionText}
      </p>
      <div className="space-y-2">
        {question.answers.map((answer) => (
          <label key={answer.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type={question.single ? 'radio' : 'checkbox'}
              name={question.id}
              checked={
                question.single
                  ? selectedAnswers === answer.id
                  : selectedAnswers.includes(answer.id)
              }
              onChange={() => handleAnswerSelect(answer.id)}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">{answer.text}</span>
            {answer.fraction && answer.fraction > 0 && (
              <CheckCircle className="text-green-600" size={12} />
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

const TrueFalsePreview: React.FC<{
  question: TrueFalseQuestion;
  userAnswers: Record<string, any>;
  onAnswerChange: (answerId: string, value: any) => void;
}> = ({ question, userAnswers, onAnswerChange }) => {
  const selectedAnswer = userAnswers[question.id];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        {(question as any).text || (question as any).questionText}
      </p>
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={question.id}
            checked={selectedAnswer === true}
            onChange={() => onAnswerChange(question.id, true)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Vrai</span>
          {question.correctAnswer === true && (
            <CheckCircle className="text-green-600" size={12} />
          )}
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={question.id}
            checked={selectedAnswer === false}
            onChange={() => onAnswerChange(question.id, false)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Faux</span>
          {question.correctAnswer === false && (
            <CheckCircle className="text-green-600" size={12} />
          )}
        </label>
      </div>
    </div>
  );
};

const ShortAnswerPreview: React.FC<{
  question: ShortAnswerQuestion;
  userAnswers: Record<string, any>;
  onAnswerChange: (answerId: string, value: any) => void;
}> = ({ question, userAnswers, onAnswerChange }) => {
  const userAnswer = userAnswers[question.id] || '';

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        {(question as any).text || (question as any).questionText}
      </p>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => onAnswerChange(question.id, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Votre réponse..."
      />
      {question.answers.length > 0 && (
        <div className="text-xs text-gray-500">
          Réponses acceptées : {question.answers.map(a => a.text).join(', ')}
        </div>
      )}
    </div>
  );
};

const MatchingPreview: React.FC<{
  question: MatchingQuestion;
  userAnswers: Record<string, any>;
  onAnswerChange: (answerId: string, value: any) => void;
}> = ({ question, userAnswers, onAnswerChange }) => {
  const userMatches = userAnswers[question.id] || {};

  const handleMatchChange = (subquestionId: string, answerText: string) => {
    const newMatches = { ...userMatches, [subquestionId]: answerText };
    onAnswerChange(question.id, newMatches);
  };

  const availableAnswers = question.subquestions.map(sq => sq.answerText);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        {(question as any).text || (question as any).questionText}
      </p>
      <div className="space-y-3">
        {question.subquestions.map((subquestion) => (
          <div key={subquestion.id} className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 min-w-0 flex-1">
              {subquestion.text}
            </span>
            <select
              value={userMatches[subquestion.id] || ''}
              onChange={(e) => handleMatchChange(subquestion.id, e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir...</option>
              {availableAnswers.map((answer, index) => (
                <option key={index} value={answer}>
                  {answer}
                </option>
              ))}
            </select>
            {userMatches[subquestion.id] === subquestion.answerText && (
              <CheckCircle className="text-green-600" size={12} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionPreview;
