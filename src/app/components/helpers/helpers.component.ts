import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-helpers',
  templateUrl: './helpers.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpersComponent {}

export const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control?.value;

  if (!password) return null;

  if (/[A-Z]/.test(password) === false) {
    return {
      passwordValidator: 'Password must cointain at least one capital case',
    };
  }
  if (/[a-z]/.test(password) === false) {
    return {
      passwordValidator: 'Password must cointain at least one lower case',
    };
  }
  if (/[0-9]/.test(password) === false) {
    return {
      passwordValidator: 'Password must cointain at least one number',
    };
  }

  if (/[!@#$%^*()]/.test(password) === false) {
    return {
      passwordValidator:
        'Password must cointain at least one special character !@#$%^*()',
    };
  }

  if (/^.{6,}$/.test(password) === false) {
    return {
      passwordValidator: 'Password must have at least 6 characters',
    };
  }

  return null;
};

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('confirmPassword')?.value;

  if (!password || !repeatPassword) {
    return null;
  }

  if (password !== repeatPassword) {
    return { passwordMatchValidator: true };
  }
  return null;
};

export const dateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const day = control.get('dob.day')?.value;
  const month = control.get('dob.month')?.value;
  const year = control.get('dob.year')?.value;

  if (!day || !month || !year) {
    return null;
  }

  if (month === 2) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      if (day < 1 || day > 29) {
        return {
          dateValidator: 'day for this month must be less or equal to 29',
        };
      }
    } else {
      if (day < 1 || day > 28) {
        return {
          dateValidator: 'day for this month must be less or equal to 28',
        };
      }
    }
  } else if ([4, 6, 9, 11].indexOf(month) !== -1) {
    if (day < 1 || day > 30) {
      return {
        dateValidator: 'day for this month must be less or equal to 30',
      };
    }
  } else {
    if (day < 1 || day > 31) {
      return {
        dateValidator: 'day for this month must be less or equal to 31',
      };
    }
  }

  return null;
};
