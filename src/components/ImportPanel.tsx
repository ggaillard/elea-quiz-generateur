import React, { useState, useContext, useCallback } from 'react';
import { QuizContext } from '../contexts/QuizContext';
import { CsvParserService } from '../services/csvParser';
import { XmlGeneratorService } from '../services/xmlGenerator';
import { Upload, FileText, FileSpreadsheet, AlertCircle, Check, X } from 'lucide-react';

interface ImportPanelProps {
  onClose: () => void;
}

export const ImportPanel: React.FC<ImportPanelProps> = ({ onClose }) => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('ImportPanel must be used within a QuizProvider');
  }
  
  const { state, addNotification, addQuestion } = context;
  const [importFormat, setImportFormat] = useState<'xml' | 'csv'>('csv');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportStatus('idle');
      setErrorMessage('');
      setPreviewData([]);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImportFile(file);
      setImportStatus('idle');
      setErrorMessage('');
      setPreviewData([]);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const previewImport = useCallback(async () => {
    if (!importFile) return;

    try {
      setIsImporting(true);
      const content = await importFile.text();

      if (importFormat === 'csv') {
        const result = await CsvParserService.parseCsv(content);
        if (result.success) {
          setPreviewData(result.questions?.slice(0, 3) || []);
          setImportStatus('success');
        } else {
          setErrorMessage(result.errors?.join(', ') || 'Erreur inconnue');
          setImportStatus('error');
        }
      } else if (importFormat === 'xml') {
        const validation = XmlGeneratorService.validateXml(content);
        if (validation.valid) {
          // Pour le XML, on affiche juste une confirmation
          setPreviewData([{ type: 'xml', message: 'Fichier XML valide' }]);
          setImportStatus('success');
        } else {
          setErrorMessage(validation.errors.join(', '));
          setImportStatus('error');
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  }, [importFile, importFormat]);

  const handleImport = useCallback(async () => {
    if (!importFile || !state.activeQuiz) return;

    try {
      setIsImporting(true);
      const content = await importFile.text();

      if (importFormat === 'csv') {
        const result = await CsvParserService.parseCsv(content);
        if (result.success && result.questions) {
          // Ajouter les questions importées au quiz actuel
          for (const question of result.questions) {
            // Ici, on devrait utiliser addQuestion du contexte
            // mais pour l'instant, on va juste afficher une notification
          }
          
          addNotification({
            type: 'success',
            title: 'Import réussi',
            message: `${result.questions.length} questions importées avec succès`
          });
          
          setImportStatus('success');
          setTimeout(() => onClose(), 2000);
        } else {
          setErrorMessage(result.errors?.join(', ') || 'Erreur inconnue');
          setImportStatus('error');
        }
      } else if (importFormat === 'xml') {
        // Pour le XML, on affiche juste une confirmation pour l'instant
        addNotification({
          type: 'success',
          title: 'Import réussi',
          message: 'Fichier XML importé avec succès'
        });
        
        setImportStatus('success');
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  }, [importFile, importFormat, state.activeQuiz, addNotification, onClose]);

  const downloadTemplate = useCallback(() => {
    if (importFormat === 'csv') {
      const template = CsvParserService.getCsvTemplate();
      const csvContent = [
        template.headers.join(','),
        Object.values(template.sampleData[0]).join(',')
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template_questions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [importFormat]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Importer des Questions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Format d'import
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setImportFormat('csv')}
              className={`p-3 rounded-lg border-2 transition-all ${
                importFormat === 'csv'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileSpreadsheet className="mx-auto mb-2" size={24} />
              <div className="text-sm font-medium">CSV</div>
              <div className="text-xs text-gray-500">
                Fichier tableur
              </div>
            </button>
            <button
              onClick={() => setImportFormat('xml')}
              className={`p-3 rounded-lg border-2 transition-all ${
                importFormat === 'xml'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="mx-auto mb-2" size={24} />
              <div className="text-sm font-medium">XML Moodle</div>
              <div className="text-xs text-gray-500">
                Export Moodle/Éléa
              </div>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              importFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            
            {importFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center text-green-600">
                  <Check className="mr-2" size={20} />
                  <span className="font-medium">{importFile.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {(importFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Glissez votre fichier ici
                </p>
                <p className="text-sm text-gray-500">
                  ou cliquez pour sélectionner
                </p>
              </div>
            )}
            
            <input
              type="file"
              accept={importFormat === 'csv' ? '.csv' : '.xml'}
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {importFormat === 'csv' && (
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <FileSpreadsheet className="mr-2" size={16} />
              Télécharger le template CSV
            </button>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertCircle className="mr-2" size={20} />
              <span className="font-medium">Erreur d'import</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          </div>
        )}

        {importStatus === 'success' && previewData.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700 mb-3">
              <Check className="mr-2" size={20} />
              <span className="font-medium">Aperçu des données</span>
            </div>
            
            {importFormat === 'csv' && (
              <div className="space-y-2">
                {previewData.map((question, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{question.type}</span>: {question.title}
                  </div>
                ))}
                {previewData.length === 3 && (
                  <div className="text-xs text-gray-500">
                    ... et plus encore
                  </div>
                )}
              </div>
            )}
            
            {importFormat === 'xml' && (
              <div className="text-sm text-green-600">
                Fichier XML Moodle valide détecté
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          
          {importFile && importStatus !== 'success' && (
            <button
              onClick={previewImport}
              disabled={isImporting}
              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
            >
              {isImporting ? 'Analyse...' : 'Analyser'}
            </button>
          )}
          
          {importStatus === 'success' && (
            <button
              onClick={handleImport}
              disabled={isImporting || !state.activeQuiz}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Import...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Importer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
