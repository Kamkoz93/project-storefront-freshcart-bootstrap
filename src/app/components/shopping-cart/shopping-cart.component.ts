import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductInBasketQueryModel } from 'src/app/query-models/product-in-basket.query-model';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartComponent {
  constructor(
    private _shoppingCartService: ShoppingCartService,
    private _router: Router
  ) {}

  readonly productList$!: Observable<ProductInBasketQueryModel[]>;

  public productsInBasket: ProductInBasketQueryModel[] = [];
  public subTotal!: number;

  ngOnInit() {
    this._shoppingCartService.loadCart();
    this.productsInBasket = this._shoppingCartService.getProduct();
  }

  //Add product to Cart
  addToCart(product: ProductInBasketQueryModel) {
    if (!this._shoppingCartService.productInCart(product)) {
      product.quantity = 1;
      this._shoppingCartService.addToCart(product);
      this.productsInBasket = [...this._shoppingCartService.getProduct()];
      this.subTotal = product.price;
    }
  }

  //Remove a Product from Cart
  removeFromCart(product: ProductInBasketQueryModel) {
    this._shoppingCartService.removeProduct(product);
    this.productsInBasket = this._shoppingCartService.getProduct();
  }

  //Calculate Total

  get total() {
    return this.productsInBasket?.reduce(
      (sum, product) => ({
        quantity: 1,
        price: !product.quantity
          ? sum.price
          : sum.price + product.quantity * product.price,
      }),
      { quantity: 1, price: 0 }
    ).price;
  }

  checkout() {
    localStorage.setItem('cart_total', JSON.stringify(this.total));
    this._router.navigate(['/payment']);
  }
}
