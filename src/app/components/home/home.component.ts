import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, map, Observable, shareReplay, take } from 'rxjs';
import { ProductCategoryModel } from '../../models/products-category.model';
import { StoreModel } from '../../models/store.model';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';
import { ProductModel } from 'src/app/models/product.model';
import { StoreWithTagsQueryModel } from 'src/app/query-models/store-with-tags.query-model';
import { StoreTagModel } from 'src/app/models/store-tag.model';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(
    private _productCategoriesService: CategoriesService,
    private _storesService: StoresService,
    private _productsService: ProductsService
  ) {}

  readonly categories$: Observable<ProductCategoryModel[]> =
    this._productCategoriesService.getAllCategories();

  readonly stores$: Observable<StoreWithTagsQueryModel[]> = combineLatest([
    this._storesService.getAllStores(),
    this._storesService.getAllStoreTags(),
  ]).pipe(
    map(([stores, storeTags]) => this.mapStoresWithTagNames(stores, storeTags))
  );

  readonly productsList$: Observable<ProductModel[]> = this._productsService
    .getAllProducts()
    .pipe(shareReplay(1));

  readonly fruitsAndVegetablesList$: Observable<ProductModel[]> =
    this.productsList$.pipe(
      map((products) => {
        return this.mapTwoFeaturesProdList(
          products.filter((product: ProductModel) => +product.categoryId === 5)
        );
      }),
      shareReplay(1)
    );
  readonly snacksAndMunchiesList$: Observable<ProductModel[]> =
    this.productsList$.pipe(
      map((products) => {
        return this.mapTwoFeaturesProdList(
          products.filter((product: ProductModel) => +product.categoryId === 2)
        );
      })
    );

  private mapStoresWithTagNames(
    stores: StoreModel[],
    storeTags: StoreTagModel[]
  ): StoreWithTagsQueryModel[] {
    const storeTagsMap = storeTags.reduce((a, c) => {
      return { ...a, [c.id]: c };
    }, {} as Record<string, StoreTagModel>);
    return stores.map((store) => ({
      ...store,
      tagNames: store.tagIds.map((tId: string) => storeTagsMap[tId]?.name),
    }));
  }

  private mapTwoFeaturesProdList(products: ProductModel[]): ProductModel[] {
    return products.sort((a, b) => b.featureValue - a.featureValue).slice(0, 5);
  }
}
