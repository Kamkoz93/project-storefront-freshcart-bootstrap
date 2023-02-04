import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductCategoryModel } from '../../models/products-category.model';
import { ProductWithRatingOptionsQueryModel } from '../../query-models/product-with-rating-options.query-model';
import { PaginationDataModel } from '../../models/pagination-data.model';
import { FilterModel } from '../../models/filter.model';
import { StoreModel } from '../../models/store.model';
import { ProductInBasketQueryModel } from '../../query-models/product-in-basket.query-model';

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
    private _productsService: ProductsService,
    private _storesService: StoresService,
    private _shoppingCartService: ShoppingCartService
  ) {}

  readonly categoriesList$: Observable<ProductCategoryModel[]> =
    this._categoriesService.getAllCategories().pipe(shareReplay(1));

  readonly pageParams$: Observable<Params> = this._activatedRoute.params.pipe(
    map((params) => ({
      categoryId: params['categoryId'],
    })),
    shareReplay(1)
  );

  readonly productsByCategoryInit$: Observable<
    ProductWithRatingOptionsQueryModel[]
  > = this.pageParams$.pipe(
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

  private _categoryIdSubject$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  public categoryId$: Observable<string> =
    this._categoryIdSubject$.asObservable();

  readonly categoryDetails$: Observable<ProductCategoryModel> =
    this.categoryId$.pipe(
      switchMap((data) => this._categoriesService.getCategoryById(data))
    );

  readonly pagination$: Observable<PaginationDataModel> =
    this._activatedRoute.queryParams.pipe(
      map((params) => ({
        pageNumber: params['pageNumber'] ? +params['pageNumber'] : 1,
        pageSize: params['pageSize'] ? +params['pageSize'] : 5,
      })),
      shareReplay(1)
    );

  readonly pageSizeOptions$: Observable<number[]> = of([5, 10, 15]);

  readonly filterForm: FormGroup = new FormGroup({
    priceFrom: new FormControl(''),
    priceTo: new FormControl(''),
    rating: new FormControl(''),
    storesArray: new FormArray([]),
    typedStoreName: new FormControl(''),
  });

  readonly selectedFilterValues$: Observable<FilterModel> =
    this.filterForm.valueChanges.pipe(
      startWith({
        priceFrom: 0,
        priceTo: 9999999,
        rating: null,
        typedStoreName: '',
      }),
      shareReplay(1)
    );

  readonly stores$: Observable<StoreModel[]> = combineLatest([
    this._storesService.getAllStores(),
    this.selectedFilterValues$,
  ]).pipe(
    map(([stores, searchForm]) =>
      stores.filter((store) =>
        store.name
          .toLowerCase()
          .includes(searchForm.typedStoreName?.toLowerCase())
      )
    )
  );

  readonly storeCheckboxes$: Observable<string[]> = this.stores$.pipe(
    map((stores) => stores.map((store) => store.id))
  );

  readonly productsByCategory$: Observable<
    ProductWithRatingOptionsQueryModel[]
  > = combineLatest([
    this.productsByCategoryInit$,
    this.sortOrder$,
    this.pagination$,
    this.selectedFilterValues$,
  ]).pipe(
    map(([products, order, pagination, filter]) => {
      const prodsWithRatings =
        this.mapProductsToProductsWithRatingOptions(products);
      const sortedProducts = this.sortProds([...prodsWithRatings], order);
      const filteredProducts = this.filterProducts([...sortedProducts], filter);
      return this.paginateData(filteredProducts, pagination);
    })
  );

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

  public sortProdsSubject(order: any): void {
    this._sortSubject.next(order.value);
  }

  public selectCategoryId(id: string): void {
    this._categoryIdSubject$.next(id);
  }

  public sortProds(
    products: ProductWithRatingOptionsQueryModel[],
    sortOrder: string
  ): ProductWithRatingOptionsQueryModel[] {
    switch (sortOrder) {
      case 'Price: Low to High':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'Featured':
        products.sort((a, b) => b.featureValue - a.featureValue);
        break;
      case 'Avg. Rating':
        products.sort((a, b) => b.ratingValue - a.ratingValue);
        break;
    }
    return products;
  }

  public mapProductsToProductsWithRatingOptions(
    products: ProductWithRatingOptionsQueryModel[]
  ): ProductWithRatingOptionsQueryModel[] {
    return products.map((product) => ({
      ...product,
      ratingOptions: this.createRatingOptions(product.ratingValue),
    }));
  }

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

  private paginateData(
    products: ProductWithRatingOptionsQueryModel[],
    pageData: PaginationDataModel
  ): ProductWithRatingOptionsQueryModel[] {
    return products.slice(
      pageData.pageSize * (pageData.pageNumber - 1),
      pageData.pageSize * pageData.pageNumber
    );
  }

  public updatePageNum(pageNumber: number): void {
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
  }

  public updatePageSize(pageSize: number): void {
    combineLatest([
      this.pagination$.pipe(take(1)),
      this.productsByCategoryInit$,
    ])
      .pipe(
        tap(([params, products]) => {
          this._router.navigate([], {
            queryParams: {
              pageNumber: 1,
              pageSize: pageSize,
            },
          });
        })
      )
      .subscribe();
  }

  public filterStores(event: any) {
    const storesArray = this.filterForm.get('storesArray') as FormArray;
    if (event.target.checked) {
      storesArray.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      storesArray.controls.forEach((store) => {
        if (store.value === event.target.value) {
          storesArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public filterProducts(
    products: ProductWithRatingOptionsQueryModel[],
    filter: {
      priceFrom: number;
      priceTo: number;
      rating: number;
      storesArray: string[];
    }
  ): ProductWithRatingOptionsQueryModel[] {
    return products.filter(
      (product) =>
        (!filter.priceFrom || filter.priceFrom <= product.price) &&
        (!filter.priceTo || filter.priceTo >= product.price) &&
        (!filter.rating || filter.rating <= product.ratingValue) &&
        (!filter.storesArray ||
          filter.storesArray.length === 0 ||
          filter.storesArray.some((val) => product.storeIds.includes(val)))
    );
  }

  ngOnInit() {
    combineLatest([this.pageParams$, this.pagination$])
      .pipe(
        tap(([params, pagination]) => {
          this._router.navigate([], {
            queryParams: {
              pageNumber: pagination.pageNumber,
              pageSize: pagination.pageSize,
            },
            queryParamsHandling: 'merge',
          });
          this._categoryIdSubject$.next(params['categoryId']);
        })
      )
      .subscribe();
  }

  public productsInBasket: ProductInBasketQueryModel[] = [];
  public subTotal!: number;

  addToCart(product: ProductInBasketQueryModel) {
    if (!this._shoppingCartService.productInCart(product)) {
      product.quantity = 1;
      this._shoppingCartService.addToCart(product);
      this.productsInBasket = [...this._shoppingCartService.getProduct()];
      this.subTotal = product.price;
    }
  }
}
