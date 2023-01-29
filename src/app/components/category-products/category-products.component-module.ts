import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryProductsComponent } from './category-products.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [CommonModule, RouterModule, MatListModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent],
})
export class CategoryProductsComponentModule {}
