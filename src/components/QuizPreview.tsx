import React, { useState, useContext } from 'react';
import { QuizContext } from '../contexts/QuizContext';
import { QuestionUnion } from '../types';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';

interface QuizPreviewProps {
  onClose: () => void;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ onClose }) => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('QuizPreview must be used within a QuizProvider');
  }
  
  const { state } = context;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const quiz = state.activeQuiz;
  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleStart = () => {
    setQuizStarted(true);
    setStartTime(new Date());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setEndTime(null);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setEndTime(new Date());
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setStartTime(null);
    setEndTime(null);
  };

  const getScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      let questionScore = 0;
      let questionMaxScore = 1;

      if (question.type === 'mcq') {
        const mcqQuestion = question as any;
        questionMaxScore = mcqQuestion.single ? 1 : mcqQuestion.answers.length;
        
        if (mcqQuestion.single) {
          const correctAnswer = mcqQuestion.answers.find((a: any) => a.fraction > 0);
          if (correctAnswer && userAnswer === correctAnswer.id) {
            questionScore = 1;
          }
        } else {
          // Logique pour QCM multiple
          const selectedAnswers = userAnswer || [];
          mcqQuestion.answers.forEach((answer: any) => {
            if (selectedAnswers.includes(answer.id) && answer.fraction > 0) {
              questionScore += 1;
            } else if (selectedAnswers.includes(answer.id) && answer.fraction === 0) {
              questionScore -= 0.5; // Pénalité pour mauvaise réponse
            }
          });
          questionScore = Math.max(0, questionScore);
        }
      } else if (question.type === 'truefalse') {
        const tfQuestion = question as any;
        if (userAnswer === tfQuestion.correctAnswer) {
          questionScore = 1;
        }
      } else if (question.type === 'shortanswer') {
        const saQuestion = question as any;
        const correctAnswers = saQuestion.answers || [];
        const userText = (userAnswer || '').toLowerCase().trim();
        
        for (const correctAnswer of correctAnswers) {
          if (correctAnswer.text.toLowerCase().trim() === userText) {
            questionScore = (correctAnswer.fraction || 100) / 100;
            break;
          }
        }
      } else if (question.type === 'matching') {
        const matchQuestion = question as any;
        const userMatches = userAnswer || {};
        let correctMatches = 0;
        
        matchQuestion.subquestions.forEach((subq: any) => {
          if (userMatches[subq.id] === subq.answerText) {
            correctMatches++;
          }
        });
        
        questionScore = correctMatches / matchQuestion.subquestions.length;
        questionMaxScore = 1;
      }

      totalScore += questionScore;
      maxScore += questionMaxScore;
    });

    return {
      score: totalScore,
      maxScore: maxScore,
      percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    };
  };

  const getTimeTaken = () => {
    if (!startTime || !endTime) return 0;
    return Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-semibold mb-2">Aucun quiz disponible</h2>
            <p className="text-gray-600 mb-4">Sélectionnez un quiz pour l'aperçu.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{quiz.name}</h2>
              {quiz.description && (
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!quizStarted ? (
            // Start Screen
            <div className="text-center py-8">
              <Play className="mx-auto mb-4 text-blue-500" size={64} />
              <h3 className="text-xl font-semibold mb-4">Prêt à commencer ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">~{questions.length * 2}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Score max</div>
                </div>
              </div>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Play size={20} />
                <span>Commencer le quiz</span>
              </button>
            </div>
          ) : showResults ? (
            // Results Screen
            <div className="text-center py-8">
              <div className="mb-6">
                {getScore().percentage >= 80 ? (
                  <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
                ) : getScore().percentage >= 60 ? (
                  <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                ) : (
                  <XCircle className="mx-auto mb-4 text-red-500" size={64} />
                )}
                <h3 className="text-2xl font-bold mb-2">Quiz terminé !</h3>
                <p className="text-gray-600">Voici vos résultats :</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{getScore().percentage}%</div>
                  <div className="text-sm text-gray-600">Score final</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {getScore().score.toFixed(1)}/{getScore().maxScore}
                  </div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(getTimeTaken())}</div>
                  <div className="text-sm text-gray-600">Temps</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>Recommencer</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            // Question Screen
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestionIndex + 1} sur {questions.length}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center">
                    <Clock size={16} className="mr-1" />
                    {startTime && formatTime(Math.round((new Date().getTime() - startTime.getTime()) / 1000))}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              {currentQuestion && (
                <div className="mb-6">
                  <QuestionRenderer
                    question={currentQuestion}
                    userAnswer={userAnswers[currentQuestion.id]}
                    onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher une question
const QuestionRenderer: React.FC<{
  question: QuestionUnion;
  userAnswer: any;
  onAnswer: (answer: any) => void;
}> = ({ question, userAnswer, onAnswer }) => {
  const questionText = (question as any).text || (question as any).questionText || '';
  const questionTitle = (question as any).title || (question as any).name || '';

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{questionTitle}</h3>
        <p className="text-gray-700">{questionText}</p>
      </div>

      {question.type === 'mcq' && (
        <McqRenderer question={question as any} userAnswer={userAnswer} onAnswer={onAnswer} />
      )}
      {question.type === 'truefalse' && (
        <TrueFalseRenderer question={question as any} userAnswer={userAnswer} onAnswer={onAnswer} />
      )}
      {question.type === 'shortanswer' && (
        <ShortAnswerRenderer question={question as any} userAnswer={userAnswer} onAnswer={onAnswer} />
      )}
      {question.type === 'matching' && (
        <MatchingRenderer question={question as any} userAnswer={userAnswer} onAnswer={onAnswer} />
      )}
    </div>
  );
};

// Composants pour chaque type de question
const McqRenderer: React.FC<{ question: any; userAnswer: any; onAnswer: (answer: any) => void }> = ({
  question, userAnswer, onAnswer
}) => (
  <div className="space-y-3">
    {question.answers.map((answer: any) => (
      <label key={answer.id} className="flex items-center space-x-3 cursor-pointer">
        <input
          type={question.single ? 'radio' : 'checkbox'}
          name={`question-${question.id}`}
          checked={
            question.single 
              ? userAnswer === answer.id
              : (userAnswer || []).includes(answer.id)
          }
          onChange={() => {
            if (question.single) {
              onAnswer(answer.id);
            } else {
              const current = userAnswer || [];
              const newAnswer = current.includes(answer.id)
                ? current.filter((id: string) => id !== answer.id)
                : [...current, answer.id];
              onAnswer(newAnswer);
            }
          }}
          className="text-blue-600"
        />
        <span className="text-gray-700">{answer.text}</span>
      </label>
    ))}
  </div>
);

const TrueFalseRenderer: React.FC<{ question: any; userAnswer: any; onAnswer: (answer: any) => void }> = ({
  question, userAnswer, onAnswer
}) => (
  <div className="space-y-3">
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="radio"
        name={`question-${question.id}`}
        checked={userAnswer === true}
        onChange={() => onAnswer(true)}
        className="text-blue-600"
      />
      <span className="text-gray-700">Vrai</span>
    </label>
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="radio"
        name={`question-${question.id}`}
        checked={userAnswer === false}
        onChange={() => onAnswer(false)}
        className="text-blue-600"
      />
      <span className="text-gray-700">Faux</span>
    </label>
  </div>
);

const ShortAnswerRenderer: React.FC<{ question: any; userAnswer: any; onAnswer: (answer: any) => void }> = ({
  question, userAnswer, onAnswer
}) => (
  <input
    type="text"
    value={userAnswer || ''}
    onChange={(e) => onAnswer(e.target.value)}
    placeholder="Votre réponse..."
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const MatchingRenderer: React.FC<{ question: any; userAnswer: any; onAnswer: (answer: any) => void }> = ({
  question, userAnswer, onAnswer
}) => {
  const currentAnswers = userAnswer || {};
  const availableOptions = question.subquestions.map((sq: any) => sq.answerText);

  return (
    <div className="space-y-4">
      {question.subquestions.map((subq: any) => (
        <div key={subq.id} className="flex items-center space-x-4">
          <div className="flex-1">
            <span className="text-gray-700">{subq.text}</span>
          </div>
          <div className="flex-1">
            <select
              value={currentAnswers[subq.id] || ''}
              onChange={(e) => {
                const newAnswers = { ...currentAnswers, [subq.id]: e.target.value };
                onAnswer(newAnswers);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir une réponse...</option>
              {availableOptions.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizPreview;
