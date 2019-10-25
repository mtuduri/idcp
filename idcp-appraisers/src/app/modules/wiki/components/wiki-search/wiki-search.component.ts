import { Component, OnInit, OnDestroy } from '@angular/core';
import { Issue } from 'src/app/shared/models/issue';
import { Observable, Subject } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { CarInfoService } from 'src/app/shared/services/car-info.service';
import { takeUntil, startWith, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-wiki-search',
  templateUrl: './wiki-search.component.html',
  styleUrls: ['./wiki-search.component.scss']
})
export class WikiSearchComponent implements OnInit, OnDestroy {
  public questions$: Observable<Issue[]>;
  public form = new FormGroup({});
  public model: any = {};
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [];
  private _destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private issuesService: IssuesService, private builder: FormlyFormBuilder,
              private carInfoService: CarInfoService) {
      this.builder.buildForm(this.form, this.fields, this.model, this.options);
  }

  ngOnInit() {
    this.setUpSearcher();
  }
  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }
  setUpSearcher(): void {
    this.fields = [
      {
        className: 'grid-formly-search-row',
        type: 'select',
        key: 'brand',
        templateOptions: {
          label: 'Brand',
          placeholder: 'Brand',
          options: this.carInfoService.getBrands(),
          valueProp: 'brand',
          labelProp: 'brand',
          required: true
        }
      },
      {
        className: 'grid-formly-search-row',
        type: 'select',
        key: 'model',
        templateOptions: {
          label: 'Model',
          placeholder: 'Model',
          options: [],
          valueProp: 'model',
          labelProp: 'model',
          required: true
        },
        hooks: {
          onInit: (field) => {
            const brandField = this.form.get('brand') as FormControl;
            field.templateOptions.options = brandField.valueChanges.pipe(
              takeUntil(this._destroy$),
              startWith(brandField.value),
              flatMap((brandName) => this.carInfoService.getModelsByBrand(brandName)
              ),
            );
          }
        }
      },
      {
        className: 'grid-formly-search-row',
        type: 'input',
        key: 'year',
        templateOptions: {
          label: 'Year',
          type: 'number',
          placeholder: 'Year',
          min: 0
        },
        validators: {
          validation: Validators.compose([
          Validators.pattern('^[0-9]+$')])
        }
      },
      {
        className: 'grid-formly-search-row-shrink',
        key: 'questions',
        type: 'toggle',
        defaultValue: false,
        templateOptions: {
          label: 'Questions'
        },
      },
      {
        className: 'grid-formly-search-row-shrink',
        key: 'notes',
        type: 'toggle',
        defaultValue: false,
        templateOptions: {
          label: 'Notes'
        },
      }
    ];
  }

  search(): void {
    if (this.form.invalid) {
      this.form.get('brand').markAsTouched();
      this.form.get('model').markAsTouched();
    } else {
      this.questions$ =
        this.issuesService.getIssues(this.model.brand, this.model.model, this.model.year, this.model.questions, this.model.notes);
    }
  }

  clean(): void {
    this.form.get('brand').markAsUntouched();
    this.form.get('model').markAsUntouched();
    this.model = {};
  }
}
