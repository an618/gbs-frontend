import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionnaireTemplateAnswer } from '@app/interface/interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-questionnaire-dropdown',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './questionnaire-dropdown.component.html',
})
export class QuestionnaireDropdownComponent {
  @Input({ required: true }) questionnaire!: string;
  @Input({ required: true })
  questionnairesOptions!: QuestionnaireTemplateAnswer[];
  @Output() rangeValue = new EventEmitter<Event>();
  rangeValues: Record<string, number> = {};
  setRangeValue(event: Event) {
    this.rangeValues[(event.target as HTMLInputElement).name] = Number(
      (event.target as HTMLInputElement).value
    );
    this.rangeValue.emit(event);
  }
}
