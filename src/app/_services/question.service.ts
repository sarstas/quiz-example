import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnswersQuiz } from '@app/_models/answers-quiz';
import { Observable, of } from 'rxjs';
import { ResponseFromServe } from '@app/_models/response-from-serve';
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getQuestions() {
    return this.http.get<any>(`${environment.apiUrl}public/quiz`);
  }

  sendAnswers(answer: AnswersQuiz): Observable<ResponseFromServe> {
    return this.http.post<ResponseFromServe>(
      `${environment.apiUrl}public/quiz`,
      answer
    );
  }
}

export class QuestionServiceStub {
  getQuestions(): Observable<void> {
    return of(null)
  }

  sendAnswers(answer): Observable<void> {
    return of(null)
  }

}
