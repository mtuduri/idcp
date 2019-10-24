import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from 'src/app/shared/models/issue';
import { QuestionService } from 'src/app/shared/services/question.service';

@Component({
  selector: 'app-wiki-list',
  templateUrl: './wiki-list.component.html',
  styleUrls: ['./wiki-list.component.scss']
})
export class WikiListComponent implements OnInit {
  public displayedColumns: string[];
  public questions$: Observable<Issue[]>;
  constructor(private questionService: QuestionService) {
    this.displayedColumns = ['title', 'description', 'brand', 'conditions'];
  }
  ngOnInit() {
    this.questions$ = this.questionService.getQuestions();
  }

}
