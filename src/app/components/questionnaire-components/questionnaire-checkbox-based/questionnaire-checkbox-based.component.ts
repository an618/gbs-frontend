import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionnaireTemplateAnswer } from '@app/interface/interface';

@Component({
  selector: 'app-questionnaire-checkbox-based',
  standalone: true,
  imports: [],
  templateUrl: './questionnaire-checkbox-based.component.html',
})
export class QuestionCheckboxBasedComponent {
  @Input() questionId: string = '';
  @Input() count: number = 0;
  @Input({ required: true }) questionnaire!: string;
  @Input({ required: true })
  questionnairesOptions!: QuestionnaireTemplateAnswer[];
  @Input({ required: true }) divClass!: string;
  @Input({ required: true }) h3Class!: string;
  @Output() selectedOption = new EventEmitter<Event>();
  sanitizeKey = (key: string): string => {
    return key.replace(/\./g, '');
  };
  setSelectedOption(event: Event) {
    this.selectedOption.emit(event);
  }
  selectedAnswer(answerId: string) {
    const savedAnswer = localStorage.getItem('savedAnswer') || '[]';
    if (JSON.parse(savedAnswer)[this.count]) {
      if (
        Object.keys(JSON.parse(savedAnswer)[this.count]).includes(
          this.questionId
        )
      ) {
        for (const element of JSON.parse(savedAnswer)[this.count]?.[
          this.questionId
        ]) {
          if (element.answerId === answerId) {
            return element.answerId;
          }
        }
      }
    }
    return null;
  }
}
