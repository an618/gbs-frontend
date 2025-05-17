import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@app/components/common-components';
import { ConstantService, LoggingService } from '@app/services';
import { AuthService } from '@app/services';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, NgIf, TranslateModule],
  templateUrl: './sign-in.component.html',
})
export class SiginInComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private loggingService: LoggingService,
    private toastr: ToastrService,
    public constantService: ConstantService
  ) {}

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.signInForm.valid) {
      this.loggingService.info('Sign-in attempt');
      this.authService
        .login(this.signInForm.value.username!, this.signInForm.value.password!)
        .subscribe({
          next: (response) => {
            if (response) {
              localStorage.setItem('token', response.token);
              this.toastr.success('Sign in Successfully');
              this.router.navigateByUrl('/dashboard');
              this.loggingService.info('User logged in successfully');
            }
          },
          error: (error) => {
            this.toastr.error('Invalid Credentials');
            this.loggingService.error(
              'Login failed',
              'src/components/common-components/sign-in/sign-in.component',
              'SiginInComponent',
              error.message
            );
          },
        });
    }
  }
}
