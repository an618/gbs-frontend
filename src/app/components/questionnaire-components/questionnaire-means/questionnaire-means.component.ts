import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/components/common-components';
import { ConstantService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-questionnaire-means',
  standalone: true,
  imports: [NgIf, ButtonComponent, TranslateModule],
  templateUrl: './questionnaire-means.component.html',
})
export class QuestionnaireMeansComponent {
  @Input() show: boolean = false;
  @Input() description: string = '';
  constructor(
    private router: Router,
    public constantService: ConstantService
  ) {}

  tryOurCalculator() {
    this.router.navigateByUrl(`/investment-advisor/strategy`);
  }
}
