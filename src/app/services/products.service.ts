import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private _httpClient: HttpClient) {}
  getAllProducts(): Observable<ProductModel[]> {
    return this._httpClient.get<ProductModel[]>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-products`
    );
  }
}
