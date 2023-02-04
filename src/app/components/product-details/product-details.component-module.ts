import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductDetailsComponent } from './product-details.component';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  declarations: [ProductDetailsComponent],
  providers: [],
  exports: [ProductDetailsComponent],
})
export class ProductDetailsComponentModule {}
