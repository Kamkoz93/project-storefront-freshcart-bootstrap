import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form.component';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule],
  declarations: [RegisterFormComponent],
  providers: [],
  exports: [RegisterFormComponent],
})
export class RegisterFormComponentModule {}
