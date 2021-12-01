import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Question} from "@app/_models/question";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  getQuestions() {
    return this.http.get<any>(`${environment.apiUrl}public/questions`);
  }

}
