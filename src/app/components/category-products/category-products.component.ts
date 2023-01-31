import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  combineLatest,
  tap,
} from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { ProductCategoryModel } from 'src/app/models/products-category.model';
import { ProductWithRatingOptionsQueryModel } from 'src/app/query-models/product-with-rating-options.query-model';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent implements OnInit {
  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _productsService: ProductsService
  ) {}

  readonly categoriesList$: Observable<ProductCategoryModel[]> =
    this._categoriesService.getAllCategories().pipe(shareReplay(1));
  readonly pageParams$: Observable<Params> = this._activatedRoute.params.pipe(
    map((params) => ({
      categoryId: params['categoryId'],
    })),
    shareReplay(1)
  );

  private _categoryIdSubject$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  public categoryId$: Observable<string> =
    this._categoryIdSubject$.asObservable();

  readonly categoryDetails$: Observable<ProductCategoryModel> =
    this.categoryId$.pipe(
      switchMap((data) => this._categoriesService.getCategoryById(data))
    );

  selectCategoryId(id: string): void {
    this._categoryIdSubject$.next(id);
  }

  readonly productsByCategory$: Observable<
    ProductWithRatingOptionsQueryModel[]
  > = this.pageParams$.pipe(
    switchMap((queryParams) => {
      return this._productsService.getAllProducts().pipe(
        map((products) => {
          const filteredProds = products.filter(
            (product) => product.categoryId === queryParams['categoryId']
          );
          return this.mapProductsToProductcWithRatingOptions(filteredProds);
        })
      );
    })
  );

  ngOnInit() {
    this.pageParams$
      .pipe(
        tap((params) => {
          this._router.navigate([], params['categoryId']);
          this._categoryIdSubject$.next(params['categoryId']);
        })
      )
      .subscribe();
  }

  mapProductsToProductcWithRatingOptions(
    products: ProductWithRatingOptionsQueryModel[]
  ): ProductWithRatingOptionsQueryModel[] {
    console.log(products.length);
    return products.map((product) => ({
      ...product,
      ratingOptions: this.createRatingOptions(product.ratingValue),
    }));
  }

  createRatingOptions(rating: number): number[] {
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

  private _sortSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Featured'
  );

  public sortOrder$: Observable<string> = this._sortSubject.asObservable();

  public sortOrderOptions$: Observable<string[]> = of([
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Avg. Rating',
  ]);

  readonly productsByCategory$: Observable<ProductModel[]> = combineLatest([
    this.pageParams$.pipe(
      switchMap((queryParams) => {
        return this._productsService
          .getAllProducts()
          .pipe(
            map((products) =>
              products.filter(
                (product) => product.categoryId === queryParams['categoryId']
              )
            )
          );
      })
    ),
    this.sortOrder$,
  ]).pipe(map(([products, order]) => this.sortProds(products, order)));

  public sortProds(
    products: ProductModel[],
    sortOrder: string
  ): ProductModel[] {
    sortOrder === 'Price: Low to High'
      ? products.sort((a, b) => a.price - b.price)
      : sortOrder === 'Price: High to Low'
      ? products.sort((a, b) => b.price - a.price)
      : sortOrder === 'Featured'
      ? products.sort((a, b) => b.featureValue - a.featureValue)
      : sortOrder === 'Avg. Rating'
      ? products.sort((a, b) => b.ratingValue - a.ratingValue)
      : products;
    return products;
  }

  sortProdsSubject(order: any): void {
    this._sortSubject.next(order.value);
  }
}
