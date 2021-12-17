import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnswersQuiz } from '@app/home/entietis/answers-quiz';
import { Observable, of } from 'rxjs';
import { ResponseFromServe } from '@app/home/entietis/response-from-serve';
import { environment } from '@environments/environment';
import { RestService } from '@app/shared/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(
    private http: HttpClient,
    private rest: RestService,
  ) { }

  getQuestions() {
    return this.rest.restGET(`${environment.apiUrl}public/quiz`)
  }

  sendAnswers(answer: AnswersQuiz): Observable<any> {
    return this.rest.restPOST(`${environment.apiUrl}public/quiz`, answer);
  }
}

export class QuestionServiceStub {
  getQuestions(): Observable<any> {
    return of(
      {
        data: [
          {
            id: 1,
            question: "question1",
            answers: [
              {
                id: 1,
                answerIds: [
                  {
                    id: 1,
                    value: "value1"
                  },
                  {
                    id: 2,
                    value: "value2"
                  },
                ]
              }
            ]
          }
          ]
        }
  )
  }

  sendAnswers(answer): Observable<ResponseFromServe> {
    return of({
      data: []
    })
  }

}
