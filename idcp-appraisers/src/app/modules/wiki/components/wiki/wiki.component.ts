import { Component, OnInit } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/shared/services/question.service';
import { Question, Issue } from 'src/app/shared/models/issue';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, first, flatMap } from 'rxjs/operators';
import { CarInfoService } from 'src/app/shared/services/car-info.service';


@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {
  public displayedColumns: string[];
  public form = new FormGroup({});
  public model: any = {};
  public addFlag = false;
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [];
  public questions$: Observable<Issue[]>;
  constructor(private builder: FormlyFormBuilder, private questionService: QuestionService, private carInfoService: CarInfoService) {
    this.displayedColumns = ['title', 'description', 'conditions'];
    this.builder.buildForm(this.form, this.fields, this.model, this.options);
  }

  ngOnInit(): void {
    this.setUpFormlyForm();
    this.questions$ = this.questionService.getQuestions();
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
            key: 'miles',
            fieldGroup: [
              {
                type: 'input',
                key: 'miles',
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
    console.log(this.model);
    if (this.model) {
      this.addFlag = false;
    }
  }
}
