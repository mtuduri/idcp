import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Issue } from 'src/app/shared/models/issue';
import { ActivatedRoute } from '@angular/router';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { takeUntil, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-wiki-iframe',
  templateUrl: './wiki-iframe.component.html',
  styleUrls: ['./wiki-iframe.component.scss']
})
export class WikiIframeComponent implements OnInit, OnDestroy {
  public questions$: Observable<Issue[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private issuesService: IssuesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.questions$ = this.route.queryParams.pipe(takeUntil(this._destroy$), flatMap((params) => {
      return this.issuesService.getIssues(
        params['brand'], params['model'], params['year'] ? +params['year'] : null, params['questions'], params['notes']);
    }));
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }
}
