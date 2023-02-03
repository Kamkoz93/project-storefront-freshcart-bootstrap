import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductInBasketQueryModel } from 'src/app/query-models/product-in-basket.query-model';
import { ProductService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingCartComponent {
  constructor(
    private _productsService: ProductService,
    private _router: Router
  ) {}

  readonly productList$: Observable<ProductInBasketQueryModel[]> =
    this._productsService.getAllProducts();

  public productsInBasket: ProductInBasketQueryModel[] = [];
  public subTotal!: number;

  ngOnInit() {
    this._productsService.loadCart();
    this.productsInBasket = this._productsService.getProduct();
  }

  //Add product to Cart
  addToCart(product: ProductInBasketQueryModel) {
    if (!this._productsService.productInCart(product)) {
      product.quantity = 1;
      this._productsService.addToCart(product);
      this.productsInBasket = [...this._productsService.getProduct()];
      this.subTotal = product.price;
    }
  }

  //Remove a Product from Cart
  removeFromCart(product: ProductInBasketQueryModel) {
    this._productsService.removeProduct(product);
    this.productsInBasket = this._productsService.getProduct();
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
