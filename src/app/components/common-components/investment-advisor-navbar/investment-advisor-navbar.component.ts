import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarMenu } from '@app/interface/interface';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@app/components/common-components/button/button.component';

@Component({
  selector: 'app-investment-advisor-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, ButtonComponent],
  templateUrl: './investment-advisor-navbar.component.html',
  styles:
    '.isActive{ color: #e33133;background-color: #EBF2F9;border-bottom: 4px solid #e33133;}',
})
export class InvestmentAdvisorNavbarComponent {
  @Input() navMenu!: NavbarMenu[];
  @Input() saveDraft!: string;
}
