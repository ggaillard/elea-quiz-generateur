import * as React from 'react';
import { QuizProvider } from './contexts/QuizContext';
import { QuizBuilder } from './components/QuizBuilder';
import { NotificationContainer } from './components/NotificationContainer';

export function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-gray-50">
        <QuizBuilder />
        <NotificationContainer />
      </div>
    </QuizProvider>
  );
}
