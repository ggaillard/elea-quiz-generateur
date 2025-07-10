import * as React from 'react';
import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { QuestionEditor } from './QuestionEditor';
import { QuestionList } from './QuestionList';
import { ExportPanel } from './ExportPanel';
import { ImportPanel } from './ImportPanel';
import { WelcomeScreen } from './WelcomeScreen';
import { QuizSettings } from './QuizSettings';

type ViewMode = 'welcome' | 'questions' | 'settings' | 'export' | 'import';

export function QuizBuilder() {
  const { state } = useQuiz();
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Automatically switch to questions view when a quiz is selected
  React.useEffect(() => {
    if (state.currentQuiz && viewMode === 'welcome') {
      setViewMode('questions');
    }
  }, [state.currentQuiz, viewMode]);

  const renderMainContent = () => {
    switch (viewMode) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'questions':
        return (
          <div className="flex h-full">
            <div className="flex-1 flex flex-col">
              <QuestionList />
            </div>
            {state.selectedQuestionId && (
              <div className="w-1/2 border-l border-gray-200">
                <QuestionEditor />
              </div>
            )}
          </div>
        );
      case 'settings':
        return <QuizSettings />;
      case 'export':
        return <ExportPanel />;
      case 'import':
        return <ImportPanel />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={viewMode}
        onViewChange={setViewMode}
      />
      
      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentView={viewMode}
          onViewChange={setViewMode}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
