import { Component, OnInit } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { map, startWith, tap, first, flatMap } from 'rxjs/operators';
import { CarInfoService } from 'src/app/shared/services/car-info.service';
import { MatStepper } from '@angular/material/stepper';

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-wiki-abm',
  templateUrl: './wiki-abm.component.html',
  styleUrls: ['./wiki-abm.component.scss']
})
export class WikiAbmComponent implements OnInit {
  public activedStep = 0;
  public form;
  public model: any = {};
  public addFlag = false;
  public options;
  public fields: FormlyFieldConfig[] = [];
  public steps: StepType[];
  constructor(private builder: FormlyFormBuilder, private carInfoService: CarInfoService) {
    this.builder.buildForm(this.form, this.fields, this.model, this.options);
  }

  ngOnInit(): void {
    this.setUpSteps();
  }

  setUpSteps(): void {
    this.steps = [
      {
        label: 'Issue Information',
        fields: [
          {
            className: 'grid-formly-row',
            key: 'issue_title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              placeholder: 'Title',
              required: true
            }
          },
          {
            className: 'grid-formly-row',
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
            className: 'grid-formly-row',
            fieldGroup: [
              {
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
                className: 'grid-formly-row',
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
                    const brandField = this.form.controls[0].get('issue_conditions').get('brand') as FormControl;
                    field.templateOptions.options = brandField.valueChanges.pipe(
                      startWith(brandField.value),
                      flatMap((brandName) => this.carInfoService.getModelsByBrand(brandName)
                      ),
                    );
                  }
                }
              },
              {
                className: 'grid-formly-row',
                key: 'year',
                fieldGroupClassName: 'split-form',
                fieldGroup: [
                  {
                    type: 'input',
                    key: 'year',
                    templateOptions: {
                      label: 'Year',
                      type: 'number',
                      placeholder: 'Year',
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
                className: 'grid-formly-row',
                fieldGroupClassName: 'split-form',
                fieldGroup: [
                  {
                    type: 'input',
                    key: 'value',
                    templateOptions: {
                      label: 'Miles',
                      type: 'number',
                      placeholder: 'Miles',
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
        ]
      },
      {
        label: 'Question',
        fields: [
          {
            key: 'question',
            type: 'radio',
            templateOptions: {
              label: 'Question Type',
              placeholder: 'Question Type',
              required: true,
              options: [
                { value: 1, label: 'Note' },
                { value: 2, label: 'Question' },
              ],
            },
            hooks: {
              onInit: (field) => {
                field.formControl.valueChanges.pipe(
                  tap((value) => {
                    if (value === 1) {
                      field.type = 'input';
                    } else {
                      field.type = 'select';
                    }
                  }),
                ).subscribe();
              }
            }
          }
        ]
      },
      {
        label: 'Resume',
        fields: [
          {
            key: 'country',
            type: 'input',
            templateOptions: {
              label: 'Country',
              required: true,
            }
          }
        ]
      }
    ];
    this.form = new FormArray(this.steps.map(() => new FormGroup({})));
    this.options = this.steps.map(() => {});
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

  prevStep(stepper: MatStepper) {
    stepper.previous();
  }

  nextStep(stepper: MatStepper) {
    stepper.next();
  }
}
