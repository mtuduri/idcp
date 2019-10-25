import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { map, startWith, tap, first, flatMap, takeUntil } from 'rxjs/operators';
import { CarInfoService } from 'src/app/shared/services/car-info.service';
import { MatStepper } from '@angular/material/stepper';
import { Subject, Observable } from 'rxjs';
import { QuestionService } from 'src/app/shared/services/question.service';
import { Issue } from 'src/app/shared/models/issue';

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-wiki-abm',
  templateUrl: './wiki-abm.component.html',
  styleUrls: ['./wiki-abm.component.scss']
})
export class WikiAbmComponent implements OnInit, OnDestroy {
  public activedStep = 0;
  public form: FormArray;
  public model: any = {};
  public options;
  public fields: FormlyFieldConfig[] = [];
  public steps: StepType[];
  private _destroy$: Subject<boolean> = new Subject<boolean>();
  @Output() public finishCreation: EventEmitter<boolean> = new EventEmitter();
  constructor(private builder: FormlyFormBuilder, private carInfoService: CarInfoService,
              private questionService: QuestionService) {
    this.builder.buildForm(this.form, this.fields, this.model, this.options);
  }

  public ngOnInit(): void {
    this.setUpSteps();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
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
            fieldGroupClassName: 'split-form',
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
                      takeUntil(this._destroy$),
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
                        { symbol: '<' },
                        { symbol: '<=' },
                        { symbol: '>' },
                        { symbol: '>=' },
                        { symbol: '!=' },
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
                        { symbol: '<' },
                        { symbol: '<=' },
                        { symbol: '>' },
                        { symbol: '>=' },
                        { symbol: '!=' },
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
        label: 'Issue Type',
        fields: [
          {
            key: 'question',
            fieldGroup: [
              {
                key: 'action',
                type: 'radio',
                templateOptions: {
                  label: 'Issue Type ',
                  placeholder: 'Issue Type ',
                  required: true,
                  valueProp: 'label',
                  labelProp: 'label',
                  options: [
                    { label: 'Note' },
                    { label: 'Question' },
                  ]
                },
                hooks: {
                  onInit: (field) => {
                    field.formControl.valueChanges.pipe(
                      takeUntil(this._destroy$),
                      tap((value) => {
                        this.steps[1].fields[0].fieldGroup = this.steps[1].fields[0].fieldGroup.filter(x => x.key === 'action');
                        let newField;
                        if (value === 'Note') {
                          newField = {
                            key: 'note_description',
                            type: 'input',
                            templateOptions: {
                              label: 'Note',
                              placeholder: 'Type in here the text to display in the note',
                              required: true
                            }
                          };
                        } else if (value === 'Question') {
                          newField = {
                            key: 'question_type',
                            type: 'radio',
                            templateOptions: {
                              label: 'Question Type',
                              placeholder: 'Question Type',
                              required: true,
                              valueProp: 'question_type',
                              labelProp: 'label',
                              options: [
                                { question_type: 'single_select' , label: 'Single Select' },
                                { question_type: 'media' , label: 'Media Question' },
                              ]
                            },
                            hooks : {
                              onInit: (fieldSubQuestion) => {
                                fieldSubQuestion.formControl.valueChanges.pipe(
                                  takeUntil(this._destroy$),
                                  tap((valueSubQuestion) => {
                                    this.steps[1].fields[0].fieldGroup =
                                      this.steps[1].fields[0].fieldGroup.filter(x => x.key === 'action' || x.key === 'question_type');
                                    if (valueSubQuestion === 'media') {
                                      this.steps[1].fields[0].fieldGroup.push({
                                        key: 'title',
                                        type: 'input',
                                        templateOptions: {
                                          label: 'Media Question',
                                          placeholder: 'Type in here the text to display in the media question',
                                          required: true
                                        }
                                      });
                                    } else if (valueSubQuestion === 'single_select') {
                                      this.steps[1].fields[0].fieldGroup.push({
                                        key: 'title',
                                        type: 'input',
                                        templateOptions: {
                                          label: 'Question text',
                                          placeholder: 'Type in here the text to display in the question',
                                          required: true
                                        }
                                      });
                                      this.steps[1].fields[0].fieldGroup.push(
                                        {
                                          key: 'options',
                                          type: 'repeat',
                                          templateOptions: {
                                            addText: 'Add another option',
                                          },
                                          fieldArray: {
                                            fieldGroupClassName: 'split-form',
                                            fieldGroup: [
                                              {
                                                key: 'code',
                                                type: 'input',
                                                templateOptions: {
                                                  label: 'Option Value',
                                                  placeholder: 'Type in here the value of the option',
                                                  required: true
                                                }
                                              },
                                              {
                                                key: 'value',
                                                type: 'input',
                                                templateOptions: {
                                                  label: 'Option Text',
                                                  placeholder: 'Type in here the text of the option',
                                                  required: true
                                                }
                                              }
                                            ]
                                          }
                                        }
                                      );
                                    }
                                    this.resetFormGroupTypeQuestion();
                                    this.form = new FormArray(this.steps.map(() => new FormGroup({})));
                                    this.options = this.steps.map(() => { });
                                  }),
                                ).subscribe();
                              }
                            }
                          };
                        }
                        this.steps[1].fields[0].fieldGroup.push(newField);
                        this.resetFormGroupQuestion();
                        this.form = new FormArray(this.steps.map(() => new FormGroup({})));
                        this.options = this.steps.map(() => { });
                      }),
                    ).subscribe();
                  }
                }
              }
            ]
          }
        ]
      }
    ];
    this.form = new FormArray(this.steps.map(() => new FormGroup({})));
    this.options = this.steps.map(() => { });
  }

  addQuestion() {
    if (this.form.valid) {
      const modelNew = {... this.model};
      if (this.model && this.model.question && this.model.question.action === 'Note') {
        modelNew.issue_description += `. ${this.model.question.note_description}`;
        modelNew.question = null;
      } else if (this.model && this.model.question.action === 'Question') {
        const question_type = this.model.question.question_type;
        const primary_question =  this.model.question;
        modelNew.question = null;
        modelNew.question = {primary_question: primary_question};
        modelNew.question.primary_question['key'] = this.model.issue_title.replace(/\s/gi, '_');
        modelNew.question.primary_question['required'] = true;
        modelNew.question.primary_question['well_known_issue'] = true;
        modelNew.question['sub_questions'] = [];
        modelNew.question['category'] = "vehicle";
        modelNew.question.primary_question['title_short'] = 'Created by Appraisers';
        if (question_type === 'media') {
          modelNew.question.primary_question['type'] = 'media';
          modelNew.question.primary_question['validation_rule'] = `
          function (response, services) {
            return services.CustomValidationServices.validateMedia(response, '${this.model.question.title}'); }`;
          modelNew.question.primary_question['max_length'] = 500;
          modelNew.question.primary_question['ar_pictures'] = `
          function (services, context, questionKey) { return services.UtilServices.arrayOfPictures(context, questionKey); }`;

        } else if (question_type === 'single_select') {
          modelNew.question.primary_question['validation_rule'] = `
            function (response, services) {
              return services.CustomValidationServices.validateSingleSelect(response, '${this.model.question.title}');
            }`;
          modelNew.question.primary_question['type'] = 'single_select';
        }
      }
      this.questionService.postQuestion(modelNew).pipe(first()).subscribe(
        () => {
          this.finishCreation.emit(true);
        },
        (error) => {
          console.log('error');
        }
      );
    }
  }

  prevStep(stepper: MatStepper) {
    stepper.previous();
  }

  nextStep(stepper: MatStepper) {
    stepper.next();
  }

  private resetFormGroupQuestion() {
    const formGroup = (this.form.controls[1] as FormGroup).controls.question as FormGroup;
    if (formGroup.controls.note_description) {
      formGroup.removeControl('note_description');
    }
    if (formGroup.controls.question_type) {
      formGroup.removeControl('question_type');
    }
    if (formGroup.controls.title) {
      formGroup.removeControl('title');
    }
    if (this.model && this.model.question && this.model.question.question_type) {
      this.model.question.question_type = null;
    }
    if (this.model && this.model.question && this.model.question.note_description) {
      this.model.question.note_description = null;
    }
    this.resetFormGroupTypeQuestion();
  }
  private resetFormGroupTypeQuestion() {
    const formGroup = (this.form.controls[1] as FormGroup).controls.question as FormGroup;
    if (formGroup.controls.options) {
      formGroup.removeControl('options');
    }
    if (this.model && this.model.question && this.model.question.options) {
      this.model.question.options = null;
    }
    if (this.model && this.model.question && this.model.question.title) {
      this.model.question.title = null;
    }
  }
}
