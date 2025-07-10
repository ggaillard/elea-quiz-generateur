import * as React from 'react';
import { FileText, BookOpen, Star, ArrowRight } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

export function WelcomeScreen() {
  const { state } = useQuiz();

  const features = [
    {
      icon: <FileText size={24} />,
      title: 'Questions variées',
      description: 'QCM, Vrai/Faux, Réponses courtes, Appariement',
      color: 'text-blue-500'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Export Moodle/Éléa',
      description: 'Format XML compatible avec Moodle 3.x/4.x et Éléa',
      color: 'text-green-500'
    },
    {
      icon: <Star size={24} />,
      title: 'Interface moderne',
      description: 'Design intuitif avec validation temps réel',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <FileText size={64} className="mx-auto mb-4 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Générateur de QCM Éléa/Moodle
          </h1>
          <p className="text-lg text-gray-600">
            Créez facilement des quiz compatibles avec Moodle et Éléa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className={`mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              Commencer rapidement
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              Créez votre premier quiz en cliquant sur "Nouveau Quiz" dans la barre latérale
            </p>
            <div className="flex items-center justify-center text-blue-600 text-sm">
              <span>Cliquez sur "Nouveau Quiz"</span>
              <ArrowRight size={16} className="ml-2" />
            </div>
          </div>

          {state.quizzes.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">
                Vos quiz ({state.quizzes.length})
              </h3>
              <p className="text-green-800 text-sm">
                Vous avez {state.quizzes.length} quiz(s) sauvegardé(s). 
                Sélectionnez-en un dans la barre latérale pour continuer.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Toutes vos données sont sauvegardées localement dans votre navigateur.
            Utilisez les fonctions d'export/import pour sauvegarder vos quiz.
          </p>
        </div>
      </div>
    </div>
  );
}
