import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionnaireTemplate } from '@app/interface/interface';
import { ConstantService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sutaibility-questionnaire-table-6',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './sutaibility-questionnaire-table-6.component.html',
})
export class SutaibilityQuestionnaireTable6Component {
  @Input() count: number = 0;
  @Input({ required: true })
  questionnairesOptions!: QuestionnaireTemplate[];
  @Output() fieldValue = new EventEmitter<Event>();
  fieldValues: Record<string, number> = {};

  constructor(public constantService: ConstantService) {}
  setFieldValue(event: Event) {
    this.fieldValues[(event.target as HTMLInputElement).name] = Number(
      (event.target as HTMLInputElement).value
    );
    this.fieldValue.emit(event);
  }
  sanitizeKey = (key: string): string => {
    return key.replace(/\./g, '');
  };

  selectedAnswer(questionId: string) {
    const savedAnswer = localStorage.getItem('savedAnswer') || '[]';
    if (JSON.parse(savedAnswer)[this.count]) {
      if (
        Object.keys(JSON.parse(savedAnswer)[this.count]).includes(questionId)
      ) {
        return JSON.parse(savedAnswer)?.[this.count]?.[questionId].answerId;
      }
    }
    return null;
  }
}
