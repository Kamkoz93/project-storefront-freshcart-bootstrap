import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductDetailsComponent } from './product-details.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ProductDetailsComponent],
  providers: [],
  exports: [ProductDetailsComponent],
})
export class ProductDetailsComponentModule {}
