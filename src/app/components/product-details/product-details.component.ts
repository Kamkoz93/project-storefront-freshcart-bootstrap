import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProductWithRatingOptionsQueryModel } from '../../query-models/product-with-rating-options.query-model';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { ProductDetailsQueryModel } from '../../query-models/product-details.query-model';
import { ProductCategoryModel } from '../../models/products-category.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  constructor(
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _categoriesService: CategoriesService
  ) {}

  readonly product$: Observable<ProductDetailsQueryModel> =
    this._activatedRoute.params.pipe(
      switchMap((params) => this._productsService.getProductById(params['id']))
    );

  readonly productCategory$: Observable<ProductCategoryModel> =
    this.product$.pipe(
      switchMap((product) =>
        this._categoriesService.getCategoryById(product.categoryId)
      )
    );

  public createRatingOptions(rating: number): number[] {
    const ratingOptions = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        ratingOptions[i] = 1;
      } else if (i == Math.floor(rating) && rating % 1 !== 0) {
        ratingOptions[i] = 0.5;
      }
    }
    return ratingOptions;
  }

  readonly productsByCategory$: Observable<
    ProductWithRatingOptionsQueryModel[]
  > = combineLatest([
    this._productsService.getAllProducts(),
    this.product$,
  ]).pipe(
    map(([allProducts, product]) => {
      const productsWithRatings =
        this.mapProductsToProductsWithRatingOptions(allProducts);
      return productsWithRatings
        .filter((prod) => prod.categoryId === product['categoryId'])
        .slice(0, 5);
    })
  );

  public mapProductsToProductsWithRatingOptions(
    products: ProductWithRatingOptionsQueryModel[]
  ): ProductWithRatingOptionsQueryModel[] {
    return products.map((product) => ({
      ...product,
      ratingOptions: this.createRatingOptions(product.ratingValue),
    }));
  }

  readonly productWithDetails$: Observable<ProductDetailsQueryModel> =
    combineLatest([
      this.product$,
      this.productCategory$,
      this.productsByCategory$,
    ]).pipe(
      map(([product, category, similarProds]) => {
        return {
          ...product,
          categoryName: category.name,
          ratingOptions: this.createRatingOptions(product.ratingValue),
          similarProducts: similarProds,
        };
      })
    );
}
