import { Quiz, QuestionUnion, McqQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchingQuestion } from '../types';
import { escapeHtml } from '../utils';

export class XmlGeneratorService {
  private static readonly MOODLE_XML_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
<!-- question: 0  -->
<question type="category">
<category>
<text>$course$/top/Default for {QUIZ_NAME}</text>
</category>
</question>`;

  private static readonly MOODLE_XML_FOOTER = '</quiz>';

  /**
   * Génère le XML Moodle pour un quiz complet
   */
  static generateMoodleXml(quiz: Quiz): string {
    const header = this.MOODLE_XML_HEADER.replace('{QUIZ_NAME}', escapeHtml(quiz.name));
    const questions = quiz.questions.map(q => this.generateQuestionXml(q)).join('\n\n');
    
    return `${header}\n\n${questions}\n\n${this.MOODLE_XML_FOOTER}`;
  }

  /**
   * Génère le XML pour une question spécifique
   */
  private static generateQuestionXml(question: QuestionUnion): string {
    switch (question.type) {
      case 'mcq':
        return this.generateMcqXml(question as McqQuestion);
      case 'truefalse':
        return this.generateTrueFalseXml(question as TrueFalseQuestion);
      case 'shortanswer':
        return this.generateShortAnswerXml(question as ShortAnswerQuestion);
      case 'matching':
        return this.generateMatchingXml(question as MatchingQuestion);
      default:
        throw new Error(`Type de question non supporté: ${(question as any).type}`);
    }
  }

  /**
   * Génère le XML pour une question QCM
   */
  private static generateMcqXml(question: McqQuestion): string {
    const questionType = question.single ? 'multichoice' : 'multichoice';
    const single = question.single ? 'true' : 'false';
    
    const answersXml = question.answers.map(answer => `
  <answer fraction="${answer.fraction}" format="html">
    <text><![CDATA[${answer.text}]]></text>
    ${answer.feedback ? `<feedback format="html">
      <text><![CDATA[${answer.feedback}]]></text>
    </feedback>` : ''}
  </answer>`).join('');

    return `<!-- question: ${question.id}  -->
<question type="${questionType}">
  <name>
    <text>${escapeHtml(question.title)}</text>
  </name>
  <questiontext format="html">
    <text><![CDATA[${question.text}]]></text>
  </questiontext>
  <generalfeedback format="html">
    <text><![CDATA[${question.generalFeedback || ''}]]></text>
  </generalfeedback>
  <defaultgrade>${question.defaultGrade}</defaultgrade>
  <penalty>${question.penalty / 100}</penalty>
  <hidden>0</hidden>
  <single>${single}</single>
  <shuffleanswers>${question.shuffleAnswers ? '1' : '0'}</shuffleanswers>
  <answernumbering>abc</answernumbering>
  <showstandardinstruction>0</showstandardinstruction>
  ${question.correctFeedback ? `<correctfeedback format="html">
    <text><![CDATA[${question.correctFeedback}]]></text>
  </correctfeedback>` : ''}
  ${question.partiallyCorrectFeedback ? `<partiallycorrectfeedback format="html">
    <text><![CDATA[${question.partiallyCorrectFeedback}]]></text>
  </partiallycorrectfeedback>` : ''}
  ${question.incorrectFeedback ? `<incorrectfeedback format="html">
    <text><![CDATA[${question.incorrectFeedback}]]></text>
  </incorrectfeedback>` : ''}
  ${answersXml}
  ${this.generateTagsXml(question.tags)}
</question>`;
  }

  /**
   * Génère le XML pour une question Vrai/Faux
   */
  private static generateTrueFalseXml(question: TrueFalseQuestion): string {
    const trueAnswer = question.correctAnswer;
    const falseAnswer = !question.correctAnswer;

    return `<!-- question: ${question.id}  -->
<question type="truefalse">
  <name>
    <text>${escapeHtml(question.title)}</text>
  </name>
  <questiontext format="html">
    <text><![CDATA[${question.text}]]></text>
  </questiontext>
  <generalfeedback format="html">
    <text><![CDATA[${question.generalFeedback || ''}]]></text>
  </generalfeedback>
  <defaultgrade>${question.defaultGrade}</defaultgrade>
  <penalty>${question.penalty / 100}</penalty>
  <hidden>0</hidden>
  <answer fraction="${trueAnswer ? '100' : '0'}" format="moodle_auto_format">
    <text>true</text>
    ${question.trueFeedback ? `<feedback format="html">
      <text><![CDATA[${question.trueFeedback}]]></text>
    </feedback>` : ''}
  </answer>
  <answer fraction="${falseAnswer ? '100' : '0'}" format="moodle_auto_format">
    <text>false</text>
    ${question.falseFeedback ? `<feedback format="html">
      <text><![CDATA[${question.falseFeedback}]]></text>
    </feedback>` : ''}
  </answer>
  ${this.generateTagsXml(question.tags)}
</question>`;
  }

  /**
   * Génère le XML pour une question à réponse courte
   */
  private static generateShortAnswerXml(question: ShortAnswerQuestion): string {
    const answersXml = question.answers.map(answer => `
  <answer fraction="${answer.fraction}" format="moodle_auto_format">
    <text>${escapeHtml(answer.text)}</text>
    ${answer.feedback ? `<feedback format="html">
      <text><![CDATA[${answer.feedback}]]></text>
    </feedback>` : ''}
  </answer>`).join('');

    return `<!-- question: ${question.id}  -->
<question type="shortanswer">
  <name>
    <text>${escapeHtml(question.title)}</text>
  </name>
  <questiontext format="html">
    <text><![CDATA[${question.text}]]></text>
  </questiontext>
  <generalfeedback format="html">
    <text><![CDATA[${question.generalFeedback || ''}]]></text>
  </generalfeedback>
  <defaultgrade>${question.defaultGrade}</defaultgrade>
  <penalty>${question.penalty / 100}</penalty>
  <hidden>0</hidden>
  <usecase>${question.caseSensitive ? '1' : '0'}</usecase>
  ${answersXml}
  ${this.generateTagsXml(question.tags)}
</question>`;
  }

  /**
   * Génère le XML pour une question d'appariement
   */
  private static generateMatchingXml(question: MatchingQuestion): string {
    const subquestionsXml = question.subquestions.map(subq => `
  <subquestion format="html">
    <text><![CDATA[${subq.text}]]></text>
    <answer>
      <text>${escapeHtml(subq.answerText)}</text>
    </answer>
  </subquestion>`).join('');

    return `<!-- question: ${question.id}  -->
<question type="matching">
  <name>
    <text>${escapeHtml(question.title)}</text>
  </name>
  <questiontext format="html">
    <text><![CDATA[${question.text}]]></text>
  </questiontext>
  <generalfeedback format="html">
    <text><![CDATA[${question.generalFeedback || ''}]]></text>
  </generalfeedback>
  <defaultgrade>${question.defaultGrade}</defaultgrade>
  <penalty>${question.penalty / 100}</penalty>
  <hidden>0</hidden>
  <shuffleanswers>${question.shuffleAnswers ? '1' : '0'}</shuffleanswers>
  <correctfeedback format="html">
    <text>Votre réponse est correcte.</text>
  </correctfeedback>
  <partiallycorrectfeedback format="html">
    <text>Votre réponse est partiellement correcte.</text>
  </partiallycorrectfeedback>
  <incorrectfeedback format="html">
    <text>Votre réponse est incorrecte.</text>
  </incorrectfeedback>
  ${subquestionsXml}
  ${this.generateTagsXml(question.tags)}
</question>`;
  }

  /**
   * Génère le XML pour les tags
   */
  private static generateTagsXml(tags?: string[]): string {
    if (!tags || tags.length === 0) {
      return '';
    }

    return tags.map(tag => `
  <tag>
    <text>${escapeHtml(tag)}</text>
  </tag>`).join('');
  }

  /**
   * Valide et nettoie le XML généré
   */
  static validateXml(xml: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      // Vérifier les erreurs de parsing
      const parserErrors = doc.querySelectorAll('parsererror');
      if (parserErrors.length > 0) {
        parserErrors.forEach(error => {
          errors.push(error.textContent || 'Erreur de parsing XML');
        });
      }

      // Vérifications spécifiques à Moodle
      if (!doc.querySelector('quiz')) {
        errors.push('Élément racine "quiz" manquant');
      }

      const questions = doc.querySelectorAll('question');
      if (questions.length === 0) {
        errors.push('Aucune question trouvée');
      }

      questions.forEach((question, index) => {
        const type = question.getAttribute('type');
        if (!type) {
          errors.push(`Question ${index + 1}: attribut "type" manquant`);
        }

        const name = question.querySelector('name text');
        if (!name || !name.textContent?.trim()) {
          errors.push(`Question ${index + 1}: nom manquant`);
        }

        const questiontext = question.querySelector('questiontext text');
        if (!questiontext || !questiontext.textContent?.trim()) {
          errors.push(`Question ${index + 1}: texte de question manquant`);
        }
      });

    } catch (error) {
      errors.push(`Erreur lors de la validation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Fonction d'export pour générer le XML Moodle d'un quiz
 */
export function generateMoodleXML(quiz: Quiz, settings?: any): string {
  return XmlGeneratorService.generateMoodleXml(quiz);
}
