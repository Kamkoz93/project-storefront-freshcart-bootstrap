import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductWithRatingOptionsQueryModel } from '../query-models/product-with-rating-options.query-model';
import { ProductDetailsQueryModel } from '../query-models/product-details.query-model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private _httpClient: HttpClient) {}
  getAllProducts(): Observable<ProductWithRatingOptionsQueryModel[]> {
    return this._httpClient.get<ProductWithRatingOptionsQueryModel[]>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-products`
    );
  }

  getProductById(id: string): Observable<ProductDetailsQueryModel> {
    return this._httpClient.get<ProductDetailsQueryModel>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-products/${id}`
    );
  }
}
