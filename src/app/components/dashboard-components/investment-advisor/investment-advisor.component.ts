import { Component } from '@angular/core';
import { InvestmentAdvisorNavbarComponent } from '@app/components/common-components';
import { RouterOutlet } from '@angular/router';
import { ConstantService } from '@app/services';

@Component({
  selector: 'app-investment-advisor',
  standalone: true,
  imports: [RouterOutlet, InvestmentAdvisorNavbarComponent],
  templateUrl: './investment-advisor.component.html',
})
export class InvestmentAdvisorComponent {
  constructor(public constantService: ConstantService) {}
}
