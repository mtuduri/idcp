import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { configNgxFormly } from './my-ngx-formly.config';
import { FormlyFieldButtonComponent } from './custom-field/button-type.component';
import { RepeatTypeComponent } from './custom-field/repeat-section.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [FormlyFieldButtonComponent, RepeatTypeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormlyModule.forRoot(configNgxFormly),
    FormlyMaterialModule
  ],
  exports: [
    FormlyModule,
    FormlyMaterialModule
  ]
})
export class MyNgxFormlyModule { }
