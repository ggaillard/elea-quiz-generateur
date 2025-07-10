import * as React from 'react';
import { X } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { NotificationMessage } from '../types';

export function NotificationContainer() {
  const { state, removeNotification } = useQuiz();

  const getNotificationIcon = (type: NotificationMessage['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>;
      case 'error':
        return <div className="w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-white text-xs">✕</div>;
      case 'warning':
        return <div className="w-5 h-5 bg-warning-500 rounded-full flex items-center justify-center text-white text-xs">!</div>;
      case 'info':
        return <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">i</div>;
      default:
        return null;
    }
  };

  const getNotificationClass = (type: NotificationMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-success-200 bg-success-50 text-success-800';
      case 'error':
        return 'border-error-200 bg-error-50 text-error-800';
      case 'warning':
        return 'border-warning-200 bg-warning-50 text-warning-800';
      case 'info':
        return 'border-primary-200 bg-primary-50 text-primary-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  if (state.notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start p-4 rounded-lg border shadow-lg animate-slide-down max-w-md ${getNotificationClass(notification.type)}`}
        >
          {getNotificationIcon(notification.type)}
          <div className="ml-3 flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <p className="text-sm mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
