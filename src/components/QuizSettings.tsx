import * as React from 'react';
import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { Quiz } from '../types';

export function QuizSettings() {
  const { state, updateQuiz } = useQuiz();
  const [localSettings, setLocalSettings] = useState(state.currentQuiz?.settings || {
    shuffle: false,
    showFeedback: true,
    showCorrectAnswers: true,
    gradingMethod: 'highest' as const
  });

  const handleSave = async () => {
    if (state.currentQuiz) {
      const updatedQuiz: Quiz = {
        ...state.currentQuiz,
        settings: localSettings,
        modified: new Date()
      };
      await updateQuiz(updatedQuiz);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!state.currentQuiz) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Sélectionnez un quiz pour modifier ses paramètres</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Paramètres du Quiz
          </h2>

          <div className="space-y-6">
            {/* Quiz Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations générales
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du quiz
                  </label>
                  <input
                    type="text"
                    value={state.currentQuiz.name}
                    onChange={(e) => {
                      const updatedQuiz = { ...state.currentQuiz, name: e.target.value } as Quiz;
                      updateQuiz(updatedQuiz);
                    }}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={state.currentQuiz.description || ''}
                    onChange={(e) => {
                      const updatedQuiz = { ...state.currentQuiz, description: e.target.value } as Quiz;
                      updateQuiz(updatedQuiz);
                    }}
                    className="textarea w-full"
                    rows={3}
                    placeholder="Description du quiz (optionnel)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={state.currentQuiz.category}
                    onChange={(e) => {
                      const updatedQuiz = { ...state.currentQuiz, category: e.target.value } as Quiz;
                      updateQuiz(updatedQuiz);
                    }}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Quiz Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Paramètres du quiz
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mélanger les questions
                    </label>
                    <p className="text-sm text-gray-500">
                      Les questions seront affichées dans un ordre aléatoire
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.shuffle}
                      onChange={(e) => handleSettingChange('shuffle', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Afficher les commentaires
                    </label>
                    <p className="text-sm text-gray-500">
                      Les commentaires seront visibles après chaque question
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.showFeedback}
                      onChange={(e) => handleSettingChange('showFeedback', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Afficher les bonnes réponses
                    </label>
                    <p className="text-sm text-gray-500">
                      Les bonnes réponses seront visibles après le quiz
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.showCorrectAnswers}
                      onChange={(e) => handleSettingChange('showCorrectAnswers', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de notation
                  </label>
                  <select
                    value={localSettings.gradingMethod}
                    onChange={(e) => handleSettingChange('gradingMethod', e.target.value)}
                    className="select w-full"
                  >
                    <option value="highest">Note la plus haute</option>
                    <option value="average">Moyenne</option>
                    <option value="first">Première tentative</option>
                    <option value="last">Dernière tentative</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Comment calculer la note finale si plusieurs tentatives sont autorisées
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limite de temps (minutes)
                  </label>
                  <input
                    type="number"
                    value={localSettings.timeLimit || ''}
                    onChange={(e) => handleSettingChange('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="input w-full"
                    placeholder="Pas de limite"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Laissez vide pour aucune limite de temps
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de tentatives
                  </label>
                  <input
                    type="number"
                    value={localSettings.attempts || ''}
                    onChange={(e) => handleSettingChange('attempts', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="input w-full"
                    placeholder="Illimité"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Laissez vide pour un nombre illimité de tentatives
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={state.isLoading}
            >
              Sauvegarder les paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
