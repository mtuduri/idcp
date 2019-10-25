import { Component, OnInit, OnChanges } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-repeat-section',
  styleUrls: ['./repeat-section.component.scss'],
  template: `
    <div class="repeat-type-container">
      <div>
        <div *ngFor="let field of field.fieldGroup; let i = index;" class="repeat-seaction">
          <formly-field [field]="field"></formly-field>
          <div>
            <button [disabled]="!deleteAvailable"
              mat-raised-button color="accent" type="button" (click)="remove(i);setDeleteAvailable()">Remove</button>
          </div>
        </div>
      </div>
      <div>
        <button mat-raised-button color="primary" type="button" (click)="add();setDeleteAvailable()">{{ to.addText }}</button>
      </div>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldArrayType implements OnInit {
  public deleteAvailable = false;
  ngOnInit(): void {
    if (this.field.fieldGroup.length > 2) {
      while (this.field.fieldGroup.length > 2) {
        this.remove(0);
      }
    }
    if (this.field.fieldGroup.length < 2) {
      while (this.field.fieldGroup.length < 2) {
        this.add();
      }
    }
  }
  setDeleteAvailable(): void {
    this.deleteAvailable = (this.field.fieldGroup.length > 2) ? true : false;
  }
}
