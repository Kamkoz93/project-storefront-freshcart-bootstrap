import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductWithRatingOptionsQueryModel } from '../query-models/product-with-rating-options.query-model';
import { Observable } from 'rxjs';
import { ProductInBasketQueryModel } from '../query-models/product-in-basket.query-model';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public productsInBasket: ProductInBasketQueryModel[] = [];

  constructor(private _httpClient: HttpClient) {}

  getAllProducts(): Observable<ProductInBasketQueryModel[]> {
    return this._httpClient.get<ProductInBasketQueryModel[]>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-products`
    );
  }

  getProduct() {
    return this.productsInBasket;
  }

  saveCart(): void {
    localStorage.setItem('cart_items', JSON.stringify(this.productsInBasket));
  }

  addToCart(addedProduct: ProductInBasketQueryModel) {
    this.productsInBasket.push(addedProduct);
    this.saveCart();
  }

  loadCart(): void {
    this.productsInBasket =
      JSON.parse(localStorage.getItem('cart_items') as any) || [];
  }

  productInCart(product: ProductInBasketQueryModel): boolean {
    return (
      this.productsInBasket.findIndex(
        (prodInBasket) => prodInBasket.id === product.id
      ) > -1
    );
  }

  removeProduct(product: ProductInBasketQueryModel) {
    const index = this.productsInBasket.findIndex(
      (prodInBasket) => prodInBasket.id === product.id
    );

    if (index > -1) {
      this.productsInBasket.splice(index, 1);
      this.saveCart();
    }
  }

  clearProducts() {
    localStorage.clear();
  }
}
