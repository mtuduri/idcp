import { Component, OnInit } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/shared/services/question.service';
import { Question, Issue } from 'src/app/shared/models/issue';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, first, flatMap } from 'rxjs/operators';
import { CarInfoService } from 'src/app/shared/services/car-info.service';

@Component({
  selector: 'app-wiki-abm',
  templateUrl: './wiki-abm.component.html',
  styleUrls: ['./wiki-abm.component.scss']
})
export class WikiAbmComponent implements OnInit {
  public form = new FormGroup({});
  public model: any = {};
  public addFlag = false;
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [];
  constructor(private builder: FormlyFormBuilder, private carInfoService: CarInfoService) {
    this.builder.buildForm(this.form, this.fields, this.model, this.options);
  }

  ngOnInit(): void {
    this.setUpFormlyForm();
  }

  setUpFormlyForm(): void {
    this.fields = [
      {
        key: 'issue_title',
        type: 'input',
        templateOptions: {
          label: 'Title',
          placeholder: 'Title',
          required: true
        }
      },
      {
        key: 'issue_description',
        type: 'textarea',
        templateOptions: {
          label: 'Description',
          placeholder: 'Description',
          required: true
        },
      },
      {
        key: 'issue_conditions',
        fieldGroup: [
          {
            type: 'select',
            key: 'brand',
            templateOptions: {
              label: 'Brand',
              placeholder: 'Brand',
              description: 'Brand',
              options: this.carInfoService.getBrands(),
              valueProp: 'brand',
              labelProp: 'brand',
              required: true
            }
          },
          {
            type: 'select',
            key: 'model',
            templateOptions: {
              label: 'Model',
              placeholder: 'Model',
              description: 'Model',
              options: [],
              valueProp: 'model',
              labelProp: 'model',
              required: true
            },
            hooks: {
              onInit: field => {
                const brandField = this.form.get('issue_conditions').get('brand');
                field.templateOptions.options = brandField.valueChanges.pipe(
                  startWith(brandField.value),
                  flatMap((brandName) => this.carInfoService.getModelsByBrand(brandName)
                  ),
                );
              }
            }
          },
          {
            key: 'year',
            className: 'split-from',
            fieldGroup: [
              {
                type: 'input',
                key: 'year',
                templateOptions: {
                  label: 'Year',
                  placeholder: 'Year',
                  description: 'Year',
                  required: true,
                  min: 0
                },
                validators: {
                  validation: Validators.compose([Validators.required,
                    Validators.pattern('^[0-9]+$')])
                }
              },
              {
                type: 'select',
                key: 'operator',
                templateOptions: {
                  label: 'Operator',
                  placeholder: 'Operator',
                  description: 'Operator',
                  options: [
                    {symbol: '<'},
                    {symbol: '<='},
                    {symbol: '>'},
                    {symbol: '>='},
                    {symbol: '!='},
                  ],
                  valueProp: 'symbol',
                  labelProp: 'symbol',
                  required: true
                }
              }
            ]
          },
          {
            key: 'miles',
            fieldGroup: [
              {
                type: 'input',
                key: 'value',
                templateOptions: {
                  label: 'Miles',
                  placeholder: 'Miles',
                  description: 'Miles',
                  required: true,
                  min: 0
                },
                validators: {
                  validation: Validators.compose([Validators.required,
                    Validators.pattern('^[0-9]+$')])
                }
              },
              {
                type: 'select',
                key: 'operator',
                templateOptions: {
                  label: 'Operator',
                  placeholder: 'Operator',
                  description: 'Operator',
                  options: [
                    {symbol: '<'},
                    {symbol: '<='},
                    {symbol: '>'},
                    {symbol: '>='},
                    {symbol: '!='},
                  ],
                  valueProp: 'symbol',
                  labelProp: 'symbol',
                  required: true
                }
              }
            ]
          }
        ]
      }
    ];
  }
  cancelAdd(): void {
    this.model = {};
    this.form.reset();
    this.addFlag = false;
  }

  addQuestion() {
    if (this.model) {
      this.addFlag = false;
    }
  }

}
