import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryProductsComponent } from './category-products.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RouterModule, MatSelectModule, FormsModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent],
})
export class CategoryProductsComponentModule {}
