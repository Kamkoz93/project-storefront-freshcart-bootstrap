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
  take,
} from 'rxjs';
import { PaginationDataModel } from 'src/app/models/pagination-data.model';
import { ProductModel } from 'src/app/models/product.model';
import { ProductCategoryModel } from 'src/app/models/products-category.model';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { MatSelectionListChange } from '@angular/material/list';

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

  readonly pagination$: Observable<PaginationDataModel> =
    this._activatedRoute.queryParams.pipe(
      map((params) => ({
        pageNumber: params['pageNumber'] ? +params['pageNumber'] : 1,
        pageSize: params['pageSize'] ? +params['pageSize'] : 5,
      })),
      shareReplay(1)
    );

  readonly productsByCategoryInit$: Observable<ProductModel[]> =
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
    );

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
    this.pagination$,
  ]).pipe(
    map(([products, order, pagination]) => {
      this.sortProds(products, order);
      return this.paginateData(products, pagination);
    })
  );

  public paginateData(
    products: ProductModel[],
    pageData: PaginationDataModel
  ): ProductModel[] {
    return products.slice(
      pageData.pageSize * (pageData.pageNumber - 1),
      pageData.pageSize * pageData.pageNumber
    );
  }

  readonly pages$: Observable<number[]> = combineLatest([
    this.productsByCategoryInit$,
    this.pagination$,
  ]).pipe(
    map(([products, params]) => {
      let result = [];
      for (
        let i = 1;
        i <= Math.ceil(products.length / params['pageSize']);
        i++
      ) {
        result.push(i);
      }
      return result;
    })
  );

  readonly pageSizeOptions$: Observable<number[]> = of([5, 10, 15]);

  updatePageNum(pageNumber: number): void {
    this.pagination$
      .pipe(
        take(1),
        tap((params) =>
          this._router.navigate([], {
            queryParams: {
              pageNumber: pageNumber,
              pageSize: params['pageSize'],
            },
          })
        )
      )
      .subscribe();
    console.log(pageNumber);
  }

  updatePageSize(pageSize: number): void {
    combineLatest([this.pagination$.pipe(take(1)), this.productsByCategory$])
      .pipe(
        tap(([params, products]) => {
          this._router.navigate([], {
            queryParams: {
              pageNumber: Math.min(Math.ceil(products.length / pageSize)),
              pageSize: pageSize,
            },
          });
        })
      )
      .subscribe();
  }
}
