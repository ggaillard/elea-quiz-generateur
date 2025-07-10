import * as React from 'react';
import { Menu, Plus, Settings, Download, Upload, FileText, Save, HelpCircle } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Header({ onToggleSidebar, currentView, onViewChange }: HeaderProps) {
  const { state, saveCurrentQuiz } = useQuiz();

  const getViewTitle = () => {
    switch (currentView) {
      case 'welcome':
        return 'Accueil';
      case 'questions':
        return state.currentQuiz ? `Quiz: ${state.currentQuiz.name}` : 'Questions';
      case 'settings':
        return 'Paramètres du Quiz';
      case 'export':
        return 'Exporter';
      case 'import':
        return 'Importer';
      default:
        return 'Générateur de QCM';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center space-x-2">
          <FileText size={24} className="text-primary-600" />
          <h1 className="text-xl font-semibold text-gray-900">
            {getViewTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {state.currentQuiz && (
          <>
            <button
              onClick={() => saveCurrentQuiz()}
              className="btn btn-ghost btn-sm"
              disabled={state.isLoading}
            >
              <Save size={16} />
              <span className="ml-1">Sauvegarder</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <button
              onClick={() => onViewChange('settings')}
              className={`btn btn-ghost btn-sm ${currentView === 'settings' ? 'bg-gray-100' : ''}`}
            >
              <Settings size={16} />
              <span className="ml-1">Paramètres</span>
            </button>
            
            <button
              onClick={() => onViewChange('export')}
              className={`btn btn-ghost btn-sm ${currentView === 'export' ? 'bg-gray-100' : ''}`}
            >
              <Download size={16} />
              <span className="ml-1">Exporter</span>
            </button>
            
            <button
              onClick={() => onViewChange('import')}
              className={`btn btn-ghost btn-sm ${currentView === 'import' ? 'bg-gray-100' : ''}`}
            >
              <Upload size={16} />
              <span className="ml-1">Importer</span>
            </button>
          </>
        )}
        
        <div className="w-px h-6 bg-gray-300" />
        
        <button
          className="btn btn-ghost btn-sm"
          title="Aide"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
}
