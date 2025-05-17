import { Component } from '@angular/core';
import { ButtonComponent } from '@app/components/common-components/button/button.component';
import { ConstantService, InvestmentService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-portfolio-export',
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
  templateUrl: './portfolio-export.component.html',
})
export class PortfolioExportComponent {
  disableDownloadButton: boolean = JSON.parse(
    localStorage.getItem('disable') || 'false'
  );
  constructor(
    private investmentService: InvestmentService,
    public constantService: ConstantService
  ) {}

  download() {
    const userPorfolioId = localStorage.getItem('userPorfolioId') || '';
    this.investmentService.exportUserPortfolio(userPorfolioId).subscribe();
    this.disableDownloadButton = true;
    localStorage.setItem('disable', JSON.stringify(true));
  }

  // placeOrder() {}
}
