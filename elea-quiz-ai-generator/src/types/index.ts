// Types pour le générateur de QCM IA
export interface AIConfig {
  provider: 'openai' | 'azure-openai' | 'mistral';
  model: string;
  apiKey: string;
  endpoint?: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  safePrompt?: boolean; // Paramètre spécifique à Mistral
}

export interface QuizGenerationConfig {
  type: 'mcq' | 'true-false' | 'short-answer' | 'matching' | 'drag-drop' | 'mixed';
  count: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  domain?: string;
  style: 'academic' | 'practical' | 'assessment';
  language: 'fr' | 'en' | 'auto';
  includeExplanations: boolean;
  difficultyDistribution?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface PDFAnalysisResult {
  id: string;
  filename: string;
  pageCount: number;
  wordCount: number;
  language: string;
  extractedText: string;
  chunks: PDFChunk[];
  metadata: PDFMetadata;
  concepts: string[];
  keywords: string[];
  images: ExtractedImage[];
  tables: ExtractedTable[];
  analysisDate: Date;
  processingTime: number;
}

export interface PDFChunk {
  id: string;
  content: string;
  pageNumber: number;
  startPosition: number;
  endPosition: number;
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'image-caption';
  level?: number; // Pour les headings
  context: ChunkContext;
  concepts: string[];
  keywords: string[];
  semanticScore: number;
  readabilityScore: number;
}

export interface ChunkContext {
  previousChunk?: string;
  nextChunk?: string;
  section?: string;
  chapter?: string;
  topic?: string;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageSize: { width: number; height: number };
  encrypted: boolean;
  permissions: string[];
}

export interface ExtractedImage {
  id: string;
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
  format: string;
  size: number;
  caption?: string;
  description?: string;
  base64Data?: string;
}

export interface ExtractedTable {
  id: string;
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
  headers: string[];
  rows: string[][];
  caption?: string;
  description?: string;
}

export interface GeneratedQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'short-answer' | 'matching' | 'drag-drop';
  question: string;
  options?: string[];
  correct: number | boolean | string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
  sourceChunk: string;
  pageReference: number;
  qualityScore: number;
  tags: string[];
  metadata: QuestionMetadata;
}

export interface QuestionMetadata {
  bloomLevel: string;
  cognitiveLoad: number;
  estimatedTime: number;
  relatedConcepts: string[];
  suggestedPoints: number;
  feedbackType: 'immediate' | 'delayed' | 'none';
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  sourceDocument: string;
  generationConfig: QuizGenerationConfig;
  questions: GeneratedQuestion[];
  metadata: QuizMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizMetadata {
  totalQuestions: number;
  questionTypes: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  estimatedDuration: number;
  totalPoints: number;
  concepts: string[];
  learningObjectives: string[];
  prerequisites: string[];
}

export interface EleaDeploymentConfig {
  courseId: number;
  categoryId?: number;
  title: string;
  description?: string;
  instructions?: string;
  timeLimit?: number;
  attempts?: number;
  gradeToPass?: number;
  showFeedback: boolean;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  availability: {
    startDate?: Date;
    endDate?: Date;
    visible: boolean;
  };
  notification: {
    email: boolean;
    recipients: string[];
    template: string;
  };
}

export interface EleaQuizFormat {
  id: string;
  name: string;
  intro: string;
  questions: EleaQuestion[];
  settings: EleaSettings;
}

export interface EleaQuestion {
  id: string;
  type: 'multichoice' | 'truefalse' | 'shortanswer' | 'match' | 'drag';
  name: string;
  questiontext: string;
  answers: EleaAnswer[];
  defaultgrade: number;
  penalty: number;
  feedback: string;
  tags: string[];
}

export interface EleaAnswer {
  id: string;
  text: string;
  fraction: number;
  feedback: string;
}

export interface EleaSettings {
  timeLimit: number;
  attempts: number;
  gradeToPass: number;
  layout: number;
  navmethod: string;
  questionsPerPage: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  showFeedback: boolean;
}

export interface ExportFormat {
  type: 'moodle-xml' | 'gift' | 'json' | 'csv' | 'pdf';
  filename: string;
  content: string;
  metadata: {
    version: string;
    generatedAt: Date;
    sourceQuiz: string;
  };
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  config: QuizGenerationConfig;
  sourceFile: string;
  result?: Quiz;
  error?: string;
  logs: JobLog[];
}

export interface JobLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: any;
}

export interface BatchProcessingConfig {
  inputFolder: string;
  outputFolder: string;
  filePattern: string;
  generationConfig: QuizGenerationConfig;
  exportFormats: ExportFormat['type'][];
  maxConcurrent: number;
  autoUpload: boolean;
  uploadConfig?: EleaDeploymentConfig;
}

export interface BatchProcessingResult {
  id: string;
  startTime: Date;
  endTime: Date;
  totalFiles: number;
  processedFiles: number;
  successCount: number;
  failureCount: number;
  results: BatchFileResult[];
  summary: BatchSummary;
}

export interface BatchFileResult {
  filename: string;
  status: 'success' | 'failed';
  quiz?: Quiz;
  error?: string;
  processingTime: number;
  generatedQuestions: number;
}

export interface BatchSummary {
  totalQuestions: number;
  questionsByType: Record<string, number>;
  averageProcessingTime: number;
  totalProcessingTime: number;
  concepts: string[];
  successRate: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  type: GeneratedQuestion['type'];
  language: string;
  template: string;
  variables: string[];
  examples: PromptExample[];
}

export interface PromptExample {
  input: string;
  output: string;
  explanation: string;
}

export interface AIPromptConfig {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  responseFormat: 'json' | 'text';
  examples: PromptExample[];
}

export interface QualityMetrics {
  clarity: number;
  difficulty: number;
  relevance: number;
  uniqueness: number;
  overallScore: number;
  issues: string[];
  suggestions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

export interface WebhookPayload {
  event: string;
  timestamp: Date;
  data: {
    quizId: string;
    courseId?: number;
    status: string;
    metadata: Record<string, any>;
  };
  signature: string;
}

export interface NotificationConfig {
  email: {
    enabled: boolean;
    recipients: string[];
    template: string;
    subject: string;
  };
  webhook: {
    enabled: boolean;
    url: string;
    secret: string;
    events: string[];
  };
  slack: {
    enabled: boolean;
    webhook: string;
    channel: string;
  };
}

export interface AnalyticsData {
  period: 'day' | 'week' | 'month';
  metrics: {
    totalGenerations: number;
    successRate: number;
    averageProcessingTime: number;
    questionsByType: Record<string, number>;
    mostUsedConcepts: string[];
    userActivity: Record<string, number>;
  };
  charts: {
    generationsOverTime: ChartData[];
    questionTypeDistribution: ChartData[];
    difficultyDistribution: ChartData[];
  };
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface UserPreferences {
  defaultConfig: QuizGenerationConfig;
  favoriteTemplates: string[];
  recentFiles: string[];
  notifications: NotificationConfig;
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    version: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Types d'événements pour le système de monitoring
export type EventType = 
  | 'pdf.uploaded'
  | 'pdf.analyzed'
  | 'quiz.generated'
  | 'quiz.reviewed'
  | 'quiz.exported'
  | 'quiz.deployed'
  | 'error.occurred'
  | 'job.started'
  | 'job.completed'
  | 'batch.started'
  | 'batch.completed';

export interface SystemEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  metadata: {
    userAgent?: string;
    ip?: string;
    source: string;
  };
}

// Types pour l'intégration avec d'autres LMS
export interface LMSIntegration {
  type: 'moodle' | 'canvas' | 'blackboard' | 'brightspace';
  config: {
    baseUrl: string;
    apiKey: string;
    username?: string;
    password?: string;
  };
  mapping: {
    courseId: string;
    categoryId?: string;
    userId?: string;
  };
}

// Types pour les templates de quiz prédéfinis
export interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  type: 'academic' | 'certification' | 'assessment' | 'practice';
  config: QuizGenerationConfig;
  prompts: Record<string, PromptTemplate>;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    usage: number;
    rating: number;
  };
}


