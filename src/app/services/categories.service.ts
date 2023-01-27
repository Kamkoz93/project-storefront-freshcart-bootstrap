import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCategoryModel } from '../models/products-category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private _httpClient: HttpClient) {}

  getAllCategories(): Observable<ProductCategoryModel[]> {
    return this._httpClient.get<ProductCategoryModel[]>(
      'https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-categories'
    );
  }

  getCategoryById(catId: string): Observable<ProductCategoryModel> {
    return this._httpClient.get<ProductCategoryModel>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-categories/${catId}`
    );
  }
}
