import * as React from 'react';
import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { QuestionUnion, McqQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchingQuestion, ValidationError } from '../types';
import { validateQuestion, generateId, deepClone } from '../utils';

export function QuestionEditor() {
  const { state, updateQuestion, selectQuestion } = useQuiz();
  const [localQuestion, setLocalQuestion] = useState<QuestionUnion | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentQuestion = state.currentQuiz?.questions.find(q => q.id === state.selectedQuestionId);

  useEffect(() => {
    if (currentQuestion) {
      setLocalQuestion(deepClone(currentQuestion));
      setHasUnsavedChanges(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (localQuestion) {
      const errors = validateQuestion(localQuestion);
      setValidationErrors(errors);
    }
  }, [localQuestion]);

  const handleSave = async () => {
    if (localQuestion) {
      await updateQuestion(localQuestion);
      setHasUnsavedChanges(false);
    }
  };

  const handleCancel = () => {
    if (currentQuestion) {
      setLocalQuestion(deepClone(currentQuestion));
      setHasUnsavedChanges(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir fermer ?')) {
        selectQuestion(null);
      }
    } else {
      selectQuestion(null);
    }
  };

  const updateLocalQuestion = (updates: Partial<QuestionUnion>) => {
    if (localQuestion) {
      setLocalQuestion(prev => {
        if (!prev) return null;
        return { ...prev, ...updates, modified: new Date() } as QuestionUnion;
      });
      setHasUnsavedChanges(true);
    }
  };

  const renderMcqEditor = (question: McqQuestion) => {
    const addAnswer = () => {
      const newAnswer = {
        id: generateId(),
        text: '',
        fraction: 0,
        feedback: ''
      };
      updateLocalQuestion({
        answers: [...question.answers, newAnswer]
      });
    };

    const updateAnswer = (index: number, field: keyof typeof question.answers[0], value: any) => {
      const newAnswers = [...question.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      updateLocalQuestion({ answers: newAnswers });
    };

    const removeAnswer = (index: number) => {
      const newAnswers = question.answers.filter((_, i) => i !== index);
      updateLocalQuestion({ answers: newAnswers });
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de QCM
            </label>
            <select
              value={question.single ? 'single' : 'multiple'}
              onChange={(e) => updateLocalQuestion({ single: e.target.value === 'single' })}
              className="select w-full"
            >
              <option value="single">Choix unique</option>
              <option value="multiple">Choix multiple</option>
            </select>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={question.shuffleAnswers}
                onChange={(e) => updateLocalQuestion({ shuffleAnswers: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Mélanger les réponses</span>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Réponses
            </label>
            <button
              onClick={addAnswer}
              className="btn btn-ghost btn-sm"
              disabled={question.answers.length >= 10}
            >
              <Plus size={14} />
              <span className="ml-1">Ajouter</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {question.answers.map((answer, index) => (
              <div key={answer.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Réponse {index + 1}
                  </span>
                  <button
                    onClick={() => removeAnswer(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={question.answers.length <= 2}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Texte de la réponse"
                      value={answer.text}
                      onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Points (%)"
                      value={answer.fraction}
                      onChange={(e) => updateAnswer(index, 'fraction', parseInt(e.target.value) || 0)}
                      className="input w-full"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Commentaire (optionnel)"
                    value={answer.feedback || ''}
                    onChange={(e) => updateAnswer(index, 'feedback', e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire pour réponse correcte
            </label>
            <textarea
              value={question.correctFeedback || ''}
              onChange={(e) => updateLocalQuestion({ correctFeedback: e.target.value })}
              className="textarea w-full"
              rows={2}
              placeholder="Affiché quand la réponse est correcte"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire pour réponse incorrecte
            </label>
            <textarea
              value={question.incorrectFeedback || ''}
              onChange={(e) => updateLocalQuestion({ incorrectFeedback: e.target.value })}
              className="textarea w-full"
              rows={2}
              placeholder="Affiché quand la réponse est incorrecte"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTrueFalseEditor = (question: TrueFalseQuestion) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bonne réponse
          </label>
          <select
            value={question.correctAnswer.toString()}
            onChange={(e) => updateLocalQuestion({ correctAnswer: e.target.value === 'true' })}
            className="select w-full"
          >
            <option value="true">Vrai</option>
            <option value="false">Faux</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire pour "Vrai"
            </label>
            <textarea
              value={question.trueFeedback || ''}
              onChange={(e) => updateLocalQuestion({ trueFeedback: e.target.value })}
              className="textarea w-full"
              rows={3}
              placeholder="Affiché quand l'étudiant répond 'Vrai'"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire pour "Faux"
            </label>
            <textarea
              value={question.falseFeedback || ''}
              onChange={(e) => updateLocalQuestion({ falseFeedback: e.target.value })}
              className="textarea w-full"
              rows={3}
              placeholder="Affiché quand l'étudiant répond 'Faux'"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderShortAnswerEditor = (question: ShortAnswerQuestion) => {
    const addAnswer = () => {
      const newAnswer = {
        id: generateId(),
        text: '',
        fraction: 100,
        feedback: ''
      };
      updateLocalQuestion({
        answers: [...question.answers, newAnswer]
      });
    };

    const updateAnswer = (index: number, field: keyof typeof question.answers[0], value: any) => {
      const newAnswers = [...question.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      updateLocalQuestion({ answers: newAnswers });
    };

    const removeAnswer = (index: number) => {
      const newAnswers = question.answers.filter((_, i) => i !== index);
      updateLocalQuestion({ answers: newAnswers });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={question.caseSensitive}
              onChange={(e) => updateLocalQuestion({ caseSensitive: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Sensible à la casse</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Réponses acceptées
            </label>
            <button
              onClick={addAnswer}
              className="btn btn-ghost btn-sm"
              disabled={question.answers.length >= 5}
            >
              <Plus size={14} />
              <span className="ml-1">Ajouter</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {question.answers.map((answer, index) => (
              <div key={answer.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Réponse {index + 1}
                  </span>
                  <button
                    onClick={() => removeAnswer(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={question.answers.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Réponse acceptée"
                      value={answer.text}
                      onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Points (%)"
                      value={answer.fraction}
                      onChange={(e) => updateAnswer(index, 'fraction', parseInt(e.target.value) || 0)}
                      className="input w-full"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Commentaire (optionnel)"
                    value={answer.feedback || ''}
                    onChange={(e) => updateAnswer(index, 'feedback', e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMatchingEditor = (question: MatchingQuestion) => {
    const addSubquestion = () => {
      const newSubquestion = {
        id: generateId(),
        text: '',
        answerText: ''
      };
      updateLocalQuestion({
        subquestions: [...question.subquestions, newSubquestion]
      });
    };

    const updateSubquestion = (index: number, field: keyof typeof question.subquestions[0], value: any) => {
      const newSubquestions = [...question.subquestions];
      newSubquestions[index] = { ...newSubquestions[index], [field]: value };
      updateLocalQuestion({ subquestions: newSubquestions });
    };

    const removeSubquestion = (index: number) => {
      const newSubquestions = question.subquestions.filter((_, i) => i !== index);
      updateLocalQuestion({ subquestions: newSubquestions });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={question.shuffleAnswers}
              onChange={(e) => updateLocalQuestion({ shuffleAnswers: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Mélanger les réponses</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Paires à associer
            </label>
            <button
              onClick={addSubquestion}
              className="btn btn-ghost btn-sm"
            >
              <Plus size={14} />
              <span className="ml-1">Ajouter</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {question.subquestions.map((subquestion, index) => (
              <div key={subquestion.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Paire {index + 1}
                  </span>
                  <button
                    onClick={() => removeSubquestion(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={question.subquestions.length <= 2}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Question</label>
                    <input
                      type="text"
                      placeholder="Élément à associer"
                      value={subquestion.text}
                      onChange={(e) => updateSubquestion(index, 'text', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Réponse</label>
                    <input
                      type="text"
                      placeholder="Élément associé"
                      value={subquestion.answerText}
                      onChange={(e) => updateSubquestion(index, 'answerText', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionEditor = () => {
    if (!localQuestion) return null;

    switch (localQuestion.type) {
      case 'mcq':
        return renderMcqEditor(localQuestion as McqQuestion);
      case 'truefalse':
        return renderTrueFalseEditor(localQuestion as TrueFalseQuestion);
      case 'shortanswer':
        return renderShortAnswerEditor(localQuestion as ShortAnswerQuestion);
      case 'matching':
        return renderMatchingEditor(localQuestion as MatchingQuestion);
      default:
        return <div>Type de question non supporté</div>;
    }
  };

  if (!localQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Sélectionnez une question pour la modifier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Modifier la question
          </h2>
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-yellow-600">Non sauvegardé</span>
            )}
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              disabled={validationErrors.some(e => e.severity === 'error')}
            >
              <Save size={16} />
              <span className="ml-1">Sauvegarder</span>
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-ghost btn-sm"
              disabled={!hasUnsavedChanges}
            >
              Annuler
            </button>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    error.severity === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {error.severity === 'error' ? (
                      <AlertCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    <span className="text-sm font-medium">{error.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Basic Question Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations générales
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la question
                </label>
                <input
                  type="text"
                  value={localQuestion.title}
                  onChange={(e) => updateLocalQuestion({ title: e.target.value })}
                  className="input w-full"
                  placeholder="Titre descriptif de la question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Énoncé de la question
                </label>
                <textarea
                  value={localQuestion.text}
                  onChange={(e) => updateLocalQuestion({ text: e.target.value })}
                  className="textarea w-full"
                  rows={4}
                  placeholder="Énoncé complet de la question"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note par défaut
                  </label>
                  <input
                    type="number"
                    value={localQuestion.defaultGrade}
                    onChange={(e) => updateLocalQuestion({ defaultGrade: parseFloat(e.target.value) || 1 })}
                    className="input w-full"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pénalité (%)
                  </label>
                  <input
                    type="number"
                    value={localQuestion.penalty}
                    onChange={(e) => updateLocalQuestion({ penalty: parseFloat(e.target.value) || 0 })}
                    className="input w-full"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire général
                </label>
                <textarea
                  value={localQuestion.generalFeedback || ''}
                  onChange={(e) => updateLocalQuestion({ generalFeedback: e.target.value })}
                  className="textarea w-full"
                  rows={2}
                  placeholder="Commentaire affiché après la question (optionnel)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={localQuestion.tags?.join(', ') || ''}
                  onChange={(e) => updateLocalQuestion({ 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) 
                  })}
                  className="input w-full"
                  placeholder="Tags séparés par des virgules (optionnel)"
                />
              </div>
            </div>
          </div>

          {/* Question Type Specific Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuration de la question
            </h3>
            {renderQuestionEditor()}
          </div>
        </div>
      </div>
    </div>
  );
}
