import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserService } from '../../services/register-user.service';
import {
  dateValidator,
  passwordMatchValidator,
  passwordValidator,
} from '../helpers/helpers.component';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  constructor(
    private _registerUserService: RegisterUserService,
    private _router: Router,
    private _dialogRef: MatDialogRef<RegisterFormComponent>,
    private cd: ChangeDetectorRef
  ) {}
  readonly registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [passwordValidator, Validators.required]),
      confirmPassword: new FormControl(''),
      dob: new FormGroup({
        day: new FormControl('', [
          Validators.required,
          Validators.min(1),
          Validators.max(31),
        ]),
        month: new FormControl('', [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
        ]),
        year: new FormControl('', [
          Validators.required,
          Validators.min(new Date().getFullYear() - 100),
          Validators.max(new Date().getFullYear()),
        ]),
      }),
    },
    { validators: [passwordMatchValidator, dateValidator] }
  );

  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });

  onLoginFormSubmitted(loginForm: FormGroup): void {
    this._registerUserService
      .loginUser(
        loginForm.get('email')?.value,
        loginForm.get('password')?.value
      )
      .subscribe({
        next: () => {
          this._router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          loginForm.setErrors({
            beVal: err.error.message,
          });
          this.cd.markForCheck();
        },
      });
  }

  onRegisterFormSubmitted(registerForm: FormGroup): void {
    if (registerForm.valid) {
      this._registerUserService
        .registerUser({
          data: {
            email: registerForm.value.email,
            password: registerForm.value.password,
          },
        })
        .subscribe({
          next: () => {
            this._router.navigate(['/']);
          },
          error: (err: HttpErrorResponse) => {
            registerForm.setErrors({
              beVal: err.error.message,
            });
            this.cd.markForCheck();
          },
        });
    }
  }

  closeModal(): void {
    this._dialogRef.close();
  }
}
