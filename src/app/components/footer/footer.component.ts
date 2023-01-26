import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { StoresService } from 'src/app/services/stores.service';
import { Observable, shareReplay } from 'rxjs';
import { ProductCategoryModel } from 'src/app/models/products-category.model';
import { StoreModel } from 'src/app/models/store.model';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly categories$: Observable<ProductCategoryModel[]> =
    this._productCategoriesService.getAllCategories();

  readonly stores$: Observable<StoreModel[]> =
    this._storesService.getAllStores();

  constructor(
    private _productCategoriesService: CategoriesService,
    private _storesService: StoresService
  ) {}
}
