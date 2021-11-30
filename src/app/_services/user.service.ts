import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Qustion} from "@app/_models/qustion";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getQuestions() {
    return this.http.get<Qustion[]>(`${environment.apiUrl}questions`);
  }
}
