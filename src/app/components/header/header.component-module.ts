import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [CommonModule, RouterModule, MatDialogModule],
  declarations: [HeaderComponent],
  providers: [],
  exports: [HeaderComponent],
})
export class HeaderComponentModule {}
