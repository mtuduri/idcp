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
import { MatStepperModule } from '@angular/material/stepper';
import { WikiManagerComponent } from './components/wiki-manager/wiki-manager.component';
import { WikiLibraryComponent } from './components/wiki-library/wiki-library.component';
import { WikiIframeComponent } from './components/wiki-iframe/wiki-iframe.component';
import { WikiSearchComponent } from './components/wiki-search/wiki-search.component';

@NgModule({
  declarations: [WikiComponent, WikiListComponent, WikiAbmComponent, WikiManagerComponent,
    WikiLibraryComponent, WikiIframeComponent, WikiSearchComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MyNgxFormlyModule,
    MatStepperModule,
    RouterModule.forChild([{path: '', component: WikiComponent, children: [
      {path: '', component: WikiLibraryComponent},
      {path: 'abm', component: WikiManagerComponent},
      {path: 'iframe', component: WikiIframeComponent},
      {path: 'search', component: WikiSearchComponent},
    ]}])
  ]
})
export class WikiModule { }
