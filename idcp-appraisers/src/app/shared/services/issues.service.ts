import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(private http: HttpClient) {}

  getIssues(brand: string, model: string, year: number, questions: boolean, notes: boolean): Observable<Issue[]> {
    return this.http.get<Issue[]>(
      `${environment.api.url}/issues?brand=${brand}&model=${model}&year=${year}&questions=${questions}&notes=${notes}`);
  }
}
