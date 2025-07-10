import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { 
  EleaIntegrationConfig, 
  EleaQuizData, 
  EleaDeploymentResult,
  EleaWebhookEvent,
  EleaNotificationConfig,
  Quiz,
  Question,
  QuizMetadata,
  DeploymentStatus
} from '../types/index.js';

/**
 * Service d'intégration avec la plateforme Éléa/Moodle
 * Gère la conversion, le déploiement et la synchronisation des quiz
 */
export class EleaService {
  private config: EleaIntegrationConfig;
  private readonly moodleApiVersion = '3.9';

  constructor(config: EleaIntegrationConfig) {
    this.config = config;
  }

  /**
   * Configuration du service
   */
  updateConfig(config: Partial<EleaIntegrationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Conversion d'un quiz vers le format Éléa/Moodle
   */
  async convertQuizToElea(quiz: Quiz): Promise<EleaQuizData> {
    console.log(`🔄 Conversion du quiz "${quiz.title}" vers le format Éléa...`);
    
    try {
      const eleaQuiz: EleaQuizData = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: this.mapCategoryToElea(quiz.metadata.category),
        difficulty: this.mapDifficultyToElea(quiz.metadata.difficulty),
        timeLimit: quiz.metadata.timeLimit,
        attempts: quiz.metadata.allowedAttempts,
        passingScore: quiz.metadata.passingScore,
        randomizeQuestions: quiz.metadata.randomizeQuestions,
        randomizeAnswers: quiz.metadata.randomizeAnswers,
        showFeedback: quiz.metadata.showFeedback,
        showCorrectAnswers: quiz.metadata.showCorrectAnswers,
        questions: await this.convertQuestionsToElea(quiz.questions),
        metadata: {
          createdAt: quiz.metadata.createdAt,
          updatedAt: new Date().toISOString(),
          version: quiz.metadata.version,
          author: quiz.metadata.author,
          tags: quiz.metadata.tags,
          sourceDocument: quiz.metadata.sourceDocument,
          generationType: 'ai-generated',
          eleaVersion: this.config.eleaVersion || '4.0'
        }
      };

      console.log(`✅ Quiz converti avec succès (${eleaQuiz.questions.length} questions)`);
      return eleaQuiz;
      
    } catch (error) {
      console.error('❌ Erreur lors de la conversion:', error);
      throw new Error(`Échec de la conversion vers Éléa: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Conversion des questions vers le format Éléa
   */
  private async convertQuestionsToElea(questions: Question[]): Promise<any[]> {
    return Promise.all(questions.map(async (question, index) => {
      const eleaQuestion = {
        id: question.id,
        type: this.mapQuestionTypeToElea(question.type),
        title: question.question,
        text: question.question,
        generalfeedback: question.explanation || '',
        defaultgrade: question.points || 1,
        penalty: 0.3333333,
        length: 1,
        stamp: `question_${index + 1}`,
        version: '1',
        hidden: 0,
        idnumber: question.id,
        category: 'Default',
        contextid: null,
        contextlevel: null,
        contextinstanceid: null,
        questionbankentryid: null,
        createdby: null,
        modifiedby: null,
        timecreated: Math.floor(Date.now() / 1000),
        timemodified: Math.floor(Date.now() / 1000),
        // Contenu spécifique au type de question
        ...await this.convertQuestionContent(question)
      };

      return eleaQuestion;
    }));
  }

  /**
   * Conversion du contenu spécifique d'une question
   */
  private async convertQuestionContent(question: Question): Promise<any> {
    switch (question.type) {
      case 'multiple_choice':
        return this.convertMultipleChoiceContent(question);
      case 'true_false':
        return this.convertTrueFalseContent(question);
      case 'short_answer':
        return this.convertShortAnswerContent(question);
      case 'essay':
        return this.convertEssayContent(question);
      case 'matching':
        return this.convertMatchingContent(question);
      case 'fill_blank':
        return this.convertFillBlankContent(question);
      default:
        return this.convertMultipleChoiceContent(question);
    }
  }

  /**
   * Conversion d'une question à choix multiple
   */
  private convertMultipleChoiceContent(question: Question): any {
    const answers = question.options?.map((option, index) => ({
      id: `answer_${index}`,
      answertext: option.text,
      answerformat: 1,
      fraction: option.isCorrect ? 1 : 0,
      feedback: option.explanation || '',
      feedbackformat: 1
    })) || [];

    return {
      qtype: 'multichoice',
      single: question.metadata?.allowMultipleAnswers ? 0 : 1,
      shuffleanswers: 1,
      answernumbering: 'abc',
      correctfeedback: 'Bonne réponse !',
      partiallycorrectfeedback: 'Réponse partiellement correcte.',
      incorrectfeedback: 'Réponse incorrecte.',
      answers
    };
  }

  /**
   * Conversion d'une question vrai/faux
   */
  private convertTrueFalseContent(question: Question): any {
    const trueAnswer = question.options?.find(o => o.text.toLowerCase().includes('vrai') || o.text.toLowerCase().includes('true'));
    const falseAnswer = question.options?.find(o => o.text.toLowerCase().includes('faux') || o.text.toLowerCase().includes('false'));

    return {
      qtype: 'truefalse',
      trueanswer: trueAnswer?.isCorrect ? 1 : 0,
      falseanswer: falseAnswer?.isCorrect ? 1 : 0,
      truefeedback: trueAnswer?.explanation || '',
      falsefeedback: falseAnswer?.explanation || ''
    };
  }

  /**
   * Conversion d'une question à réponse courte
   */
  private convertShortAnswerContent(question: Question): any {
    const answers = question.options?.map((option, index) => ({
      id: `answer_${index}`,
      answertext: option.text,
      answerformat: 0,
      fraction: option.isCorrect ? 1 : 0,
      feedback: option.explanation || '',
      feedbackformat: 1
    })) || [];

    return {
      qtype: 'shortanswer',
      usecase: 0,
      answers
    };
  }

  /**
   * Conversion d'une question de dissertation
   */
  private convertEssayContent(question: Question): any {
    return {
      qtype: 'essay',
      responseformat: 'editor',
      responserequired: 1,
      responsefieldlines: 15,
      attachments: 0,
      attachmentsrequired: 0,
      maxbytes: 0,
      filetypeslist: '',
      graderinfo: question.metadata?.gradingCriteria || '',
      graderinfoformat: 1,
      responsetemplate: '',
      responsetemplateformat: 1
    };
  }

  /**
   * Conversion d'une question d'appariement
   */
  private convertMatchingContent(question: Question): any {
    const subquestions = question.options?.map((option, index) => ({
      id: `subquestion_${index}`,
      questiontext: option.text,
      questiontextformat: 1,
      answertext: option.matchingText || '',
      answertextformat: 1
    })) || [];

    return {
      qtype: 'match',
      shuffleanswers: 1,
      subquestions
    };
  }

  /**
   * Conversion d'une question à trous
   */
  private convertFillBlankContent(question: Question): any {
    return {
      qtype: 'cloze',
      // Le format Cloze nécessite un formatage spécial du texte
      questiontext: this.formatClozeText(question.question, question.options || []),
      questiontextformat: 1
    };
  }

  /**
   * Formatage du texte pour les questions Cloze
   */
  private formatClozeText(text: string, options: any[]): string {
    // Remplacer les placeholders par le format Cloze
    let formattedText = text;
    options.forEach((option, index) => {
      const placeholder = `{${index}}`;
      const clozeFormat = `{1:SHORTANSWER:=${option.text}}`;
      formattedText = formattedText.replace(placeholder, clozeFormat);
    });
    return formattedText;
  }

  /**
   * Mapping du type de question vers Éléa
   */
  private mapQuestionTypeToElea(type: string): string {
    const mapping = {
      'multiple_choice': 'multichoice',
      'true_false': 'truefalse',
      'short_answer': 'shortanswer',
      'essay': 'essay',
      'matching': 'match',
      'fill_blank': 'cloze',
      'numerical': 'numerical',
      'drag_drop': 'ddwtos'
    };
    return mapping[type as keyof typeof mapping] || 'multichoice';
  }

  /**
   * Mapping de la catégorie vers Éléa
   */
  private mapCategoryToElea(category: string): string {
    const mapping = {
      'science': 'Sciences',
      'mathematics': 'Mathématiques',
      'language': 'Langues',
      'history': 'Histoire',
      'geography': 'Géographie',
      'general': 'Général'
    };
    return mapping[category as keyof typeof mapping] || 'Général';
  }

  /**
   * Mapping de la difficulté vers Éléa
   */
  private mapDifficultyToElea(difficulty: string): string {
    const mapping = {
      'easy': 'Facile',
      'medium': 'Moyen',
      'hard': 'Difficile',
      'expert': 'Expert'
    };
    return mapping[difficulty as keyof typeof mapping] || 'Moyen';
  }

  /**
   * Export du quiz au format XML Moodle
   */
  async exportToMoodleXML(eleaQuiz: EleaQuizData): Promise<string> {
    console.log(`📤 Export du quiz "${eleaQuiz.title}" au format XML Moodle...`);
    
    try {
      const xml = this.generateMoodleXML(eleaQuiz);
      
      // Sauvegarde optionnelle
      if (this.config.exportSettings?.saveToFile) {
        const fileName = `${eleaQuiz.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.xml`;
        const filePath = path.join(this.config.exportSettings.exportPath || './exports', fileName);
        await writeFile(filePath, xml, 'utf8');
        console.log(`📁 Quiz sauvegardé dans: ${filePath}`);
      }
      
      return xml;
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'export XML:', error);
      throw new Error(`Échec de l'export XML: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Génération du XML Moodle
   */
  private generateMoodleXML(eleaQuiz: EleaQuizData): string {
    const questions = eleaQuiz.questions.map(q => this.generateQuestionXML(q)).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <!-- Quiz généré automatiquement par Éléa AI Quiz Generator -->
  <!-- Titre: ${eleaQuiz.title} -->
  <!-- Date: ${new Date().toISOString()} -->
  
  ${questions}
  
  <!-- Configuration du quiz -->
  <question type="category">
    <category>
      <text>${eleaQuiz.category}</text>
    </category>
    <info format="html">
      <text><![CDATA[${eleaQuiz.description}]]></text>
    </info>
  </question>
  
</quiz>`;
  }

  /**
   * Génération du XML pour une question
   */
  private generateQuestionXML(question: any): string {
    const qtype = question.qtype || 'multichoice';
    
    let questionXML = `
  <question type="${qtype}">
    <name>
      <text>${this.escapeXML(question.title)}</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[${question.text}]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[${question.generalfeedback}]]></text>
    </generalfeedback>
    <defaultgrade>${question.defaultgrade}</defaultgrade>
    <penalty>${question.penalty}</penalty>
    <hidden>${question.hidden}</hidden>
    <idnumber>${question.idnumber}</idnumber>`;

    // Ajouter le contenu spécifique au type
    switch (qtype) {
      case 'multichoice':
        questionXML += this.generateMultipleChoiceXML(question);
        break;
      case 'truefalse':
        questionXML += this.generateTrueFalseXML(question);
        break;
      case 'shortanswer':
        questionXML += this.generateShortAnswerXML(question);
        break;
      case 'essay':
        questionXML += this.generateEssayXML(question);
        break;
      case 'match':
        questionXML += this.generateMatchingXML(question);
        break;
      case 'cloze':
        questionXML += this.generateClozeXML(question);
        break;
    }

    questionXML += `
  </question>`;

    return questionXML;
  }

  /**
   * Génération XML pour question à choix multiple
   */
  private generateMultipleChoiceXML(question: any): string {
    const answers = question.answers?.map((answer: any) => `
    <answer fraction="${answer.fraction * 100}" format="html">
      <text><![CDATA[${answer.answertext}]]></text>
      <feedback format="html">
        <text><![CDATA[${answer.feedback}]]></text>
      </feedback>
    </answer>`).join('') || '';

    return `
    <single>${question.single}</single>
    <shuffleanswers>${question.shuffleanswers}</shuffleanswers>
    <answernumbering>${question.answernumbering}</answernumbering>
    <correctfeedback format="html">
      <text><![CDATA[${question.correctfeedback}]]></text>
    </correctfeedback>
    <partiallycorrectfeedback format="html">
      <text><![CDATA[${question.partiallycorrectfeedback}]]></text>
    </partiallycorrectfeedback>
    <incorrectfeedback format="html">
      <text><![CDATA[${question.incorrectfeedback}]]></text>
    </incorrectfeedback>
    ${answers}`;
  }

  /**
   * Génération XML pour question vrai/faux
   */
  private generateTrueFalseXML(question: any): string {
    return `
    <answer fraction="${question.trueanswer * 100}" format="moodle_auto_format">
      <text>true</text>
      <feedback format="html">
        <text><![CDATA[${question.truefeedback}]]></text>
      </feedback>
    </answer>
    <answer fraction="${question.falseanswer * 100}" format="moodle_auto_format">
      <text>false</text>
      <feedback format="html">
        <text><![CDATA[${question.falsefeedback}]]></text>
      </feedback>
    </answer>`;
  }

  /**
   * Génération XML pour question à réponse courte
   */
  private generateShortAnswerXML(question: any): string {
    const answers = question.answers?.map((answer: any) => `
    <answer fraction="${answer.fraction * 100}" format="moodle_auto_format">
      <text>${this.escapeXML(answer.answertext)}</text>
      <feedback format="html">
        <text><![CDATA[${answer.feedback}]]></text>
      </feedback>
    </answer>`).join('') || '';

    return `
    <usecase>${question.usecase}</usecase>
    ${answers}`;
  }

  /**
   * Génération XML pour question de dissertation
   */
  private generateEssayXML(question: any): string {
    return `
    <responseformat>${question.responseformat}</responseformat>
    <responserequired>${question.responserequired}</responserequired>
    <responsefieldlines>${question.responsefieldlines}</responsefieldlines>
    <attachments>${question.attachments}</attachments>
    <attachmentsrequired>${question.attachmentsrequired}</attachmentsrequired>
    <graderinfo format="html">
      <text><![CDATA[${question.graderinfo}]]></text>
    </graderinfo>
    <responsetemplate format="html">
      <text><![CDATA[${question.responsetemplate}]]></text>
    </responsetemplate>`;
  }

  /**
   * Génération XML pour question d'appariement
   */
  private generateMatchingXML(question: any): string {
    const subquestions = question.subquestions?.map((sub: any, index: number) => `
    <subquestion format="html">
      <text><![CDATA[${sub.questiontext}]]></text>
      <answer>
        <text>${this.escapeXML(sub.answertext)}</text>
      </answer>
    </subquestion>`).join('') || '';

    return `
    <shuffleanswers>${question.shuffleanswers}</shuffleanswers>
    ${subquestions}`;
  }

  /**
   * Génération XML pour question Cloze
   */
  private generateClozeXML(question: any): string {
    return `
    <questiontext format="html">
      <text><![CDATA[${question.questiontext}]]></text>
    </questiontext>`;
  }

  /**
   * Déploiement du quiz sur Éléa/Moodle
   */
  async deployToElea(eleaQuiz: EleaQuizData): Promise<EleaDeploymentResult> {
    console.log(`🚀 Déploiement du quiz "${eleaQuiz.title}" sur Éléa...`);
    
    try {
      // Vérification de la configuration
      if (!this.config.apiEndpoint || !this.config.apiKey) {
        throw new Error('Configuration Éléa incomplète (endpoint ou clé API manquante)');
      }

      // Préparation des données
      const deploymentData = {
        quiz: eleaQuiz,
        course: this.config.courseId,
        category: this.config.categoryId,
        options: {
          visible: this.config.deploymentOptions?.visible ?? true,
          notify: this.config.deploymentOptions?.notifyUsers ?? false,
          backup: this.config.deploymentOptions?.createBackup ?? true
        }
      };

      // Appel à l'API Éléa
      const response = await this.makeApiCall('POST', '/quiz/deploy', deploymentData);
      
      const result: EleaDeploymentResult = {
        success: response.success,
        quizId: response.quizId,
        url: response.url,
        deploymentId: response.deploymentId,
        timestamp: new Date().toISOString(),
        message: response.message,
        errors: response.errors || []
      };

      if (result.success) {
        console.log(`✅ Quiz déployé avec succès: ${result.url}`);
        
        // Notification optionnelle
        if (this.config.notifications?.onSuccess) {
          await this.sendNotification('success', result);
        }
      } else {
        console.error('❌ Échec du déploiement:', result.errors);
        
        // Notification d'erreur
        if (this.config.notifications?.onError) {
          await this.sendNotification('error', result);
        }
      }

      return result;
      
    } catch (error) {
      console.error('❌ Erreur lors du déploiement:', error);
      const result: EleaDeploymentResult = {
        success: false,
        quizId: '',
        url: '',
        deploymentId: '',
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        errors: [error instanceof Error ? error.message : 'Erreur inconnue']
      };

      if (this.config.notifications?.onError) {
        await this.sendNotification('error', result);
      }

      return result;
    }
  }

  /**
   * Appel générique à l'API Éléa
   */
  private async makeApiCall(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.config.apiEndpoint}${endpoint}`;
    const options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'User-Agent': 'Elea-Quiz-AI-Generator/1.0.0'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Erreur API Éléa: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Envoi de notification
   */
  private async sendNotification(type: 'success' | 'error', result: EleaDeploymentResult): Promise<void> {
    try {
      const notificationConfig = this.config.notifications;
      if (!notificationConfig) return;

      const message = {
        type,
        title: type === 'success' ? 'Quiz déployé avec succès' : 'Échec du déploiement',
        message: result.message,
        url: result.url,
        timestamp: result.timestamp,
        details: type === 'error' ? result.errors : undefined
      };

      // Webhook
      if (notificationConfig.webhook) {
        await fetch(notificationConfig.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
      }

      // Email (si configuré)
      if (notificationConfig.email) {
        // Implémentation email à ajouter selon le service utilisé
        console.log('📧 Notification email:', message);
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de notification:', error);
    }
  }

  /**
   * Vérification du statut de déploiement
   */
  async checkDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    try {
      const response = await this.makeApiCall('GET', `/quiz/deployment/${deploymentId}/status`);
      return response.status;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du statut:', error);
      return 'error';
    }
  }

  /**
   * Synchronisation avec Éléa
   */
  async syncWithElea(quizId: string): Promise<boolean> {
    try {
      const response = await this.makeApiCall('POST', `/quiz/${quizId}/sync`);
      return response.success;
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      return false;
    }
  }

  /**
   * Gestion des webhooks Éléa
   */
  async handleWebhook(event: EleaWebhookEvent): Promise<void> {
    console.log(`🔔 Webhook reçu: ${event.type} pour ${event.resourceId}`);
    
    switch (event.type) {
      case 'quiz.completed':
        await this.handleQuizCompleted(event);
        break;
      case 'quiz.updated':
        await this.handleQuizUpdated(event);
        break;
      case 'deployment.failed':
        await this.handleDeploymentFailed(event);
        break;
      default:
        console.log(`Type de webhook non géré: ${event.type}`);
    }
  }

  /**
   * Gestion de l'événement quiz terminé
   */
  private async handleQuizCompleted(event: EleaWebhookEvent): Promise<void> {
    // Implémentation selon les besoins
    console.log(`Quiz terminé: ${event.resourceId}`);
  }

  /**
   * Gestion de l'événement quiz mis à jour
   */
  private async handleQuizUpdated(event: EleaWebhookEvent): Promise<void> {
    // Implémentation selon les besoins
    console.log(`Quiz mis à jour: ${event.resourceId}`);
  }

  /**
   * Gestion de l'événement échec de déploiement
   */
  private async handleDeploymentFailed(event: EleaWebhookEvent): Promise<void> {
    // Implémentation selon les besoins
    console.error(`Échec de déploiement: ${event.resourceId}`);
  }

  /**
   * Échappement XML
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Validation de la configuration
   */
  validateConfig(): boolean {
    const required = ['apiEndpoint', 'apiKey'];
    return required.every(key => this.config[key as keyof EleaIntegrationConfig]);
  }

  /**
   * Test de connexion à Éléa
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeApiCall('GET', '/health');
      return response.status === 'ok';
    } catch (error) {
      console.error('❌ Test de connexion échoué:', error);
      return false;
    }
  }
}

// Export d'une fonction factory pour créer une instance
export function createEleaService(config: EleaIntegrationConfig): EleaService {
  return new EleaService(config);
}
