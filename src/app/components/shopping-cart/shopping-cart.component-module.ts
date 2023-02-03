import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShoppingCartComponent } from './shopping-cart.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [ShoppingCartComponent],
  providers: [],
  exports: [ShoppingCartComponent],
})
export class ShoppingCartComponentModule {}
