import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionnaireTemplate } from '@app/interface/interface';

@Component({
  selector: 'app-questionnaire-range-input-based',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './questionnaire-range-input-based.component.html',
})
export class QuestionRangeInputBasedComponent {
  @Input() financialSituation: any = {};
  @Input() questionId: string = '';
  @Input() count: number = 0;
  @Input({ required: true }) questionnaire!: QuestionnaireTemplate;
  @Output() rangeValue = new EventEmitter<Event>();

  rangeValues: Record<string, number> = {};
  setRangeValue(event: Event) {
    const target = event.target as HTMLInputElement;
    if (Number(target.value) > 10000000) {
      target.value = '10000000';
    } else if (Number(target.value) < 0) {
      target.value = '0';
    }
    this.rangeValues[target.name] = Number(target.value);
    this.rangeValue.emit(event);
  }

  get freeCashFlow() {
    return (
      Number(this.financialSituation['Total Annual Income (a)']) -
      Number(this.financialSituation['Total Annual Expenses (b)'])
    );
  }

  get netAssetValue() {
    return (
      Number(this.financialSituation['Total Asset (d)']) -
      Number(this.financialSituation['Total Liabilities (e)'])
    );
  }

  get selectedAnswer() {
    const savedAnswer = localStorage.getItem('savedAnswer') || '[]';
    if (JSON.parse(savedAnswer)[this.count]) {
      if (
        Object.keys(JSON.parse(savedAnswer)[this.count]).includes(
          this.questionId
        )
      ) {
        return JSON.parse(savedAnswer)[this.count]?.[this.questionId]
          .answerText;
      }
    }
    return null;
  }

  keepCodeFormatted(code: string): string {
    const currencyPipe = new CurrencyPipe('en-US');
    let formattedValue: string = code.replace(/[^\d.]/g, '');
    let formattedCurrency: string =
      currencyPipe.transform(Number(formattedValue), 'USD', '', '1.0-0') || '';
    return formattedCurrency;
  }
}
