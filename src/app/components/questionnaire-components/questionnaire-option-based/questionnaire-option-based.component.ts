import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionnaireTemplateAnswer } from '@app/interface/interface';

@Component({
  selector: 'app-questionnaire-option-based',
  standalone: true,
  imports: [],
  templateUrl: './questionnaire-option-based.component.html',
})
export class QuestionnaireOptionBasedComponent {
  @Input() questionId: string = '';
  @Input() count: number = 0;
  @Input({ required: true })
  questionnaire!: string;
  @Input({ required: true })
  questionnairesOptions!: QuestionnaireTemplateAnswer[];
  @Input({ required: true }) divClass!: string;
  @Input({ required: true }) h3Class!: string;
  @Output() selectedOption = new EventEmitter<Event>();
  setSelectedOption(event: Event) {
    this.selectedOption.emit(event);
  }
  sanitizeKey = (key: string): string => {
    return key.replace(/\./g, '');
  };
  get selectedAnswer() {
    const savedAnswer = localStorage.getItem('savedAnswer') || '[]';
    if (JSON.parse(savedAnswer)[this.count]) {
      if (
        Object.keys(JSON.parse(savedAnswer)[this.count]).includes(
          this.questionId
        )
      ) {
        return JSON.parse(savedAnswer)[this.count]?.[this.questionId].answerId;
      }
    }
    return null;
  }
}
