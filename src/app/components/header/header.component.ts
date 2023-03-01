import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { StoresService } from 'src/app/services/stores.service';
import { Observable } from 'rxjs';
import { ProductCategoryModel } from 'src/app/models/products-category.model';
import { MatDialog } from '@angular/material/dialog';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly categories$: Observable<ProductCategoryModel[]> =
    this._productCategoriesService.getAllCategories();

  openRegisterModal(): void {
    this._dialog.open(RegisterFormComponent, {});
  }

  constructor(
    private _productCategoriesService: CategoriesService,
    private _storesService: StoresService,
    private _dialog: MatDialog
  ) {}
}
