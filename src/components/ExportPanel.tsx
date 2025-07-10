import React, { useState, useContext } from 'react';
import { QuizContext } from '../contexts/QuizContext';
import { generateMoodleXML } from '../services/xmlGenerator';
import { generateCSV } from '../services/csvParser';
import { Download, FileText, FileSpreadsheet, Settings, Check, AlertCircle } from 'lucide-react';

interface ExportPanelProps {
  onClose: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ onClose }) => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('ExportPanel must be used within a QuizProvider');
  }
  
  const { state } = context;
  const [exportFormat, setExportFormat] = useState<'xml' | 'csv'>('xml');
  const [exportSettings, setExportSettings] = useState({
    includeAnswers: true,
    includeMetadata: true,
    shuffleQuestions: false,
    shuffleAnswers: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    if (!state.activeQuiz || state.activeQuiz.questions.length === 0) {
      setExportStatus('error');
      return;
    }

    setIsExporting(true);
    setExportStatus('idle');

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === 'xml') {
        content = generateMoodleXML(state.activeQuiz, exportSettings);
        filename = `${state.activeQuiz.name.replace(/[^a-zA-Z0-9]/g, '_')}_moodle.xml`;
        mimeType = 'application/xml';
      } else {
        content = generateCSV(state.activeQuiz, exportSettings);
        filename = `${state.activeQuiz.name.replace(/[^a-zA-Z0-9]/g, '_')}_questions.csv`;
        mimeType = 'text/csv';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const canExport = state.activeQuiz && state.activeQuiz.questions.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Exporter le Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {!canExport ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">
              Aucun quiz ou aucune question à exporter.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Créez d'abord un quiz avec des questions.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Format d'export
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExportFormat('xml')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    exportFormat === 'xml'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">XML Moodle</div>
                  <div className="text-xs text-gray-500">
                    Compatible Moodle/Éléa
                  </div>
                </button>
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    exportFormat === 'csv'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">CSV</div>
                  <div className="text-xs text-gray-500">
                    Tableau de données
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Settings className="inline mr-2" size={16} />
                Options d'export
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeAnswers}
                    onChange={(e) =>
                      setExportSettings(prev => ({
                        ...prev,
                        includeAnswers: e.target.checked
                      }))
                    }
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Inclure les réponses correctes
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeMetadata}
                    onChange={(e) =>
                      setExportSettings(prev => ({
                        ...prev,
                        includeMetadata: e.target.checked
                      }))
                    }
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Inclure les métadonnées
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.shuffleQuestions}
                    onChange={(e) =>
                      setExportSettings(prev => ({
                        ...prev,
                        shuffleQuestions: e.target.checked
                      }))
                    }
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Mélanger les questions
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.shuffleAnswers}
                    onChange={(e) =>
                      setExportSettings(prev => ({
                        ...prev,
                        shuffleAnswers: e.target.checked
                      }))
                    }
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Mélanger les réponses
                  </span>
                </label>
              </div>
            </div>

            {exportStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-700">
                  <Check className="mr-2" size={16} />
                  <span className="text-sm font-medium">
                    Export réussi !
                  </span>
                </div>
              </div>
            )}

            {exportStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="mr-2" size={16} />
                  <span className="text-sm font-medium">
                    Erreur lors de l'export
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Export...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={16} />
                    Exporter
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
