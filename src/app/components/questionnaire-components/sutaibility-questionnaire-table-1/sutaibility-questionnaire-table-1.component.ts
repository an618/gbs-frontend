import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionnaireTemplate } from '@app/interface/interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sutaibility-questionnaire-table-1',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './sutaibility-questionnaire-table-1.component.html',
})
export class SutaibilityQuestionnaireTable1Component {
  @Input() type: string = '';
  @Input() count: number = 0;
  @Input({ required: true })
  questionnairesOptions!: QuestionnaireTemplate[];
  @Output() fieldValue = new EventEmitter<Event>();
  fieldValues: Record<string, number> = {};

  sanitizeKey = (key: string): string => {
    return key.replace(/\./g, '');
  };

  setFieldValue(event: Event) {
    const target = event.target as HTMLInputElement;

    console.log(target);
    if (target.name === 'No of Dependants') {
      if (Number(target.value) < 0) {
        target.value = '0';
      } else if (Number(target.value) > 5) {
        target.value = '5';
      }
    }
    if (target.name === 'Age/Yrs') {
      if (Number(target.value) < 0) {
        target.value = '0';
      }
    }
    this.fieldValues[target.name] = Number(target.value);
    this.fieldValue.emit(event);
  }

  selectedAnswerDropdown(questionId: string) {
    const savedAnswer = localStorage.getItem('savedAnswer') || '[]';
    if (JSON.parse(savedAnswer)[this.count]) {
      if (
        Object.keys(JSON.parse(savedAnswer)[this.count]).includes(questionId)
      ) {
        return JSON.parse(savedAnswer)[this.count][questionId].answerText;
      }
      return null;
    }
    return null;
  }
  selectedAnswer(questionId: string) {
    const savedAnswer = localStorage.getItem('savedAnswer') || '[]';
    if (JSON.parse(savedAnswer)[this.count]) {
      if (
        Object.keys(JSON.parse(savedAnswer)[this.count]).includes(questionId)
      ) {
        return JSON.parse(savedAnswer)[this.count][questionId].answerText;
      }
      return null;
    }
    return null;
  }

  getInputType(questionText: string): string {
    if (questionText === 'Age/Yrs' || questionText === 'No. of Dependants') {
      return 'number';
    } else {
      return 'text';
    }
  }
}
