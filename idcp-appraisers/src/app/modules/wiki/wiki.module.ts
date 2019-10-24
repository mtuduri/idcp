import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiComponent } from './components/wiki/wiki.component';
import { RouterModule } from '@angular/router';
import { MyNgxFormlyModule } from 'src/app/shared/modules/my-ngx-formly/my-ngx-formly.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { WikiListComponent } from './components/wiki-list/wiki-list.component';
import { WikiAbmComponent } from './components/wiki-abm/wiki-abm.component';

@NgModule({
  declarations: [WikiComponent, WikiListComponent, WikiAbmComponent],
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
