import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, MatTabsModule],
  declarations: [RegisterFormComponent],
  providers: [],
  exports: [RegisterFormComponent],
})
export class RegisterFormComponentModule {}
