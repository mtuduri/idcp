import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiComponent } from './components/wiki/wiki.component';
import { RouterModule } from '@angular/router';
import { MyNgxFormlyModule } from 'src/app/shared/modules/my-ngx-formly/my-ngx-formly.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [WikiComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MyNgxFormlyModule,
    RouterModule.forChild([{path: '', component: WikiComponent}])
  ]
})
export class WikiModule { }
