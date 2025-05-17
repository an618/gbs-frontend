import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/components/common-components';
import { AuthService, ConstantService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonComponent, TranslateModule, NgStyle, NgClass],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  selectedLanguage: string;
  show: boolean = false;
  route!: string;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {
    this.route = this.router.url.split('/')[1];
    this.translate.addLangs(['en', 'hi', 'ar']);
    let language =
      sessionStorage.getItem('lang') || this.translate.getBrowserLang() || 'en';
    if (!['en', 'hi', 'ar'].includes(language)) {
      language = 'en';
    }
    this.translate.use(language);
    this.selectedLanguage = language;
  }

  changeLanguage(event: Event): void {
    const target = (event.target as HTMLSelectElement).value;
    sessionStorage.setItem('lang', target);
    this.translate.use(target);
  }

  logout() {
    this.authService.logout().subscribe();
    this.toastr.success('Logout Successfully');
    localStorage.clear();
    this.router.navigateByUrl('sign-in');
  }

  confirmNavigation(event: MouseEvent, link: string): void {
    event.preventDefault();
    if (this.router.url === '/' + link) {
      return;
    }
    if (link === 'dashboard') {
      this.show = true;
    } else {
      this.router.navigate([link]);
    }
  }
  setNavigation(navigate: boolean) {
    if (navigate) {
      this.router.navigateByUrl('/dashboard');
    }
    this.show = false;
  }
}
