import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryProductsComponent } from './category-products.component';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent],
})
export class CategoryProductsComponentModule {}
