import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from 'src/app/shared/models/issue';
import { QuestionService } from 'src/app/shared/services/question.service';

@Component({
  selector: 'app-wiki-library',
  templateUrl: './wiki-library.component.html',
  styleUrls: ['./wiki-library.component.scss']
})
export class WikiLibraryComponent implements OnInit {
  public questions$: Observable<Issue[]>;
  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.questions$ = this.questionService.getQuestions();
  }

}
