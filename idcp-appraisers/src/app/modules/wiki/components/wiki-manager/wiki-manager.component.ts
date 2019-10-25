import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from 'src/app/shared/models/issue';
import { QuestionService } from 'src/app/shared/services/question.service';

@Component({
  selector: 'app-wiki-manager',
  templateUrl: './wiki-manager.component.html',
  styleUrls: ['./wiki-manager.component.scss']
})
export class WikiManagerComponent implements OnInit {
  public addFlag = false;
  public questions$: Observable<Issue[]>;
  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.getQuestions();
  }
  public onCreateQuestion(): void {
    this.getQuestions();
    this.addFlag = false;
  }
  private getQuestions(): void {
    this.questions$ = this.questionService.getQuestions();
  }
}
