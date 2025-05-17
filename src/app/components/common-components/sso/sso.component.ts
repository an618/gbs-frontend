import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/services';
import { LoaderComponent } from '@app/components/common-components/loader/loader.component';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './sso.component.html',
})
export class SsoComponent {
  constructor(
    private router: Router,
    private params: ActivatedRoute,
    public loader: LoaderService
  ) {
    this.loader.setLoader(true);
    this.params.queryParams.subscribe((params) => {
      const token = params['jwtToken'];
      if (token) {
        localStorage.setItem('token', token);
        this.router.navigateByUrl('/dashboard');
        this.loader.setLoader(false);
      } else {
        this.loader.setLoader(true);
      }
    });
  }
}
