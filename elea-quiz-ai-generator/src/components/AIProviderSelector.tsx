import React, { useState, useEffect } from 'react';
import { AIConfig } from '../types';
import { 
  validateAIConfig, 
  AVAILABLE_MODELS, 
  MODEL_COSTS, 
  MODEL_FEATURES,
  recommendModel 
} from '../utils/aiConfig';

interface AIProviderSelectorProps {
  config: AIConfig;
  onChange: (config: AIConfig) => void;
  disabled?: boolean;
}

/**
 * Composant pour sélectionner et configurer le provider IA
 */
export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  config,
  onChange,
  disabled = false
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recommendation, setRecommendation] = useState<string>('');

  // Validation en temps réel
  useEffect(() => {
    const validationErrors = validateAIConfig(config);
    setErrors(validationErrors);
  }, [config]);

  // Recommandation de modèle
  useEffect(() => {
    if (config.provider) {
      const recommended = recommendModel(config.provider, {
        quality: 'good',
        features: ['json-mode']
      });
      setRecommendation(recommended);
    }
  }, [config.provider]);

  const handleProviderChange = (provider: 'openai' | 'azure-openai' | 'mistral') => {
    const newConfig = { ...config, provider };
    
    // Définir un modèle par défaut selon le provider
    if (provider === 'mistral') {
      newConfig.model = 'mistral-large-latest';
      newConfig.safePrompt = true;
    } else if (provider === 'openai') {
      newConfig.model = 'gpt-4-turbo-preview';
    } else if (provider === 'azure-openai') {
      newConfig.model = 'gpt-4';
    }
    
    onChange(newConfig);
  };

  const handleConfigChange = (key: keyof AIConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const getModelInfo = (model: string) => {
    const costs = MODEL_COSTS[model];
    const features = MODEL_FEATURES[model];
    
    return {
      costs,
      features,
      description: getModelDescription(model)
    };
  };

  const getModelDescription = (model: string): string => {
    const descriptions: Record<string, string> = {
      'mistral-large-latest': 'Modèle le plus performant pour des tâches complexes',
      'mistral-large-2402': 'Version stable du modèle large',
      'mistral-medium-latest': 'Bon équilibre performance/coût',
      'mistral-small-latest': 'Rapide et économique',
      'mistral-tiny': 'Ultra rapide pour des tâches simples',
      'open-mixtral-8x7b': 'Modèle open-source performant',
      'open-mixtral-8x22b': 'Modèle open-source le plus avancé',
      'gpt-4-turbo-preview': 'Modèle GPT-4 le plus avancé',
      'gpt-4': 'Modèle GPT-4 standard',
      'gpt-3.5-turbo': 'Modèle rapide et économique'
    };
    
    return descriptions[model] || 'Modèle IA avancé';
  };

  const availableModels = AVAILABLE_MODELS[config.provider] || [];
  const currentModelInfo = getModelInfo(config.model);

  return (
    <div className="ai-provider-selector bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🤖 Configuration IA
      </h3>
      
      {/* Sélection du provider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provider IA
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['openai', 'azure-openai', 'mistral'] as const).map((provider) => (
            <button
              key={provider}
              onClick={() => handleProviderChange(provider)}
              disabled={disabled}
              className={`p-3 rounded-lg border-2 transition-all ${
                config.provider === provider
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {provider === 'openai' && '🤖'}
                  {provider === 'azure-openai' && '☁️'}
                  {provider === 'mistral' && '🌟'}
                </div>
                <div className="text-xs font-medium">
                  {provider === 'openai' && 'OpenAI'}
                  {provider === 'azure-openai' && 'Azure OpenAI'}
                  {provider === 'mistral' && 'Mistral AI'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration spécifique à Mistral */}
      {config.provider === 'mistral' && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-2">
            🌟 Configuration Mistral AI
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            Mistral AI offre des modèles performants avec une attention particulière à la sécurité et au contrôle.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-orange-700 mb-1">
                Clé API Mistral
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                placeholder="Votre clé API Mistral"
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-orange-700 mb-1">
                Mode sécurisé
              </label>
              <select
                value={config.safePrompt ? 'true' : 'false'}
                onChange={(e) => handleConfigChange('safePrompt', e.target.value === 'true')}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="true">Activé (recommandé)</option>
                <option value="false">Désactivé</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Configuration générale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sélection du modèle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle IA
          </label>
          <select
            value={config.model}
            onChange={(e) => handleConfigChange('model', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          
          {config.model && (
            <div className="mt-2 text-xs text-gray-600">
              {currentModelInfo.description}
              {currentModelInfo.costs && (
                <span className="ml-2 text-blue-600">
                  • Input: ${currentModelInfo.costs.input}/1k tokens
                  • Output: ${currentModelInfo.costs.output}/1k tokens
                </span>
              )}
            </div>
          )}
          
          {recommendation && recommendation !== config.model && (
            <div className="mt-2 text-xs text-amber-600">
              💡 Recommandé: {recommendation}
            </div>
          )}
        </div>

        {/* Clé API (pour OpenAI) */}
        {config.provider === 'openai' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clé API OpenAI
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="sk-..."
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Configuration Azure */}
        {config.provider === 'azure-openai' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint Azure
            </label>
            <input
              type="url"
              value={config.endpoint || ''}
              onChange={(e) => handleConfigChange('endpoint', e.target.value)}
              placeholder="https://your-resource.openai.azure.com/"
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Paramètres avancés */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
        >
          <span className={`mr-2 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>
            ▶
          </span>
          Paramètres avancés
        </button>
        
        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Température (0-2)
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Créativité des réponses
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tokens max
              </label>
              <input
                type="number"
                min="100"
                max="32000"
                value={config.maxTokens}
                onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Longueur max des réponses
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Top P (0-1)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.topP}
                onChange={(e) => handleConfigChange('topP', parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Diversité du vocabulaire
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fonctionnalités du modèle */}
      {config.model && currentModelInfo.features && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Fonctionnalités supportées
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentModelInfo.features.map((feature) => (
              <span
                key={feature}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Erreurs de validation */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            ⚠️ Erreurs de configuration:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Statut de validation */}
      {errors.length === 0 && config.apiKey && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center text-sm text-green-800">
            <span className="mr-2">✅</span>
            Configuration valide - Prêt pour la génération
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProviderSelector;
