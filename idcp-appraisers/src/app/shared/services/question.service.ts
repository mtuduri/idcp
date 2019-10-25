import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Issue } from '../models/issue';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.api.url}/questions`);
  }
  postQuestion(model: any): Observable<any> {
    return this.http.post<any>(`${environment.api.url}/questions`, model);
  }
}
