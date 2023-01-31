import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Observable,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  combineLatest,
  startWith,
} from 'rxjs';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';
import { ProductModel } from '../../models/product.model';
import { StoreModel } from '../../models/store.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-products',
  styleUrls: ['./store-products.component.scss'],
  templateUrl: './store-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProductsComponent implements OnInit {
  constructor(
    private _storesService: StoresService,
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService,
    private _router: Router
  ) {}

  readonly pageParams$: Observable<Params> = this._activatedRoute.params.pipe(
    map((params) => ({
      storeId: params['storeId'],
    })),
    shareReplay(1)
  );

  readonly storeProducts$: Observable<ProductModel[]> = this.pageParams$.pipe(
    switchMap((queryParams) => {
      return this._productsService
        .getAllProducts()
        .pipe(
          map((products) =>
            products.filter(
              (product) =>
                product.storeIds.indexOf(queryParams['storeId']) !== -1
            )
          )
        );
    })
  );

  readonly stores$: Observable<StoreModel> = this.pageParams$.pipe(
    switchMap((params) => this._storesService.getStoreById(params['storeId'])),
    take(1),
    shareReplay(1)
  );

  readonly searchProdInStore: FormControl = new FormControl('');
  readonly searchedTerm$: Observable<string> =
    this.searchProdInStore.valueChanges.pipe(startWith(''));

  readonly filteredStoreProds$: Observable<ProductModel[]> = combineLatest([
    this.storeProducts$,
    this.searchedTerm$,
  ]).pipe(
    map(([products, search]) =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.price.toString().includes(search.toLowerCase())
      )
    )
  );

  ngOnInit() {
    this.pageParams$
      .pipe(
        take(1),
        tap((params) => {
          this._router.navigate([], params['storeId']);
        })
      )
      .subscribe();
  }
}
