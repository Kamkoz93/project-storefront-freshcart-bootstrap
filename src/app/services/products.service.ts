import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductWithRatingOptionsQueryModel } from '../query-models/product-with-rating-options.query-model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private _httpClient: HttpClient) {}
  getAllProducts(): Observable<ProductWithRatingOptionsQueryModel[]> {
    return this._httpClient.get<ProductWithRatingOptionsQueryModel[]>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-products`
    );
  }
}
