import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, of, tap} from "rxjs";

import {environment} from "@environments/environment";
import {User} from "@app/_models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public token: string;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.token = localStorage.getItem('token');
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<any>(`${environment.apiUrl}public/login`, { email, password })
      .pipe(tap(response => {
        const {info, token} = response.data;

        localStorage.setItem('currentUser', JSON.stringify(info));
        localStorage.setItem('token', token);

        this.currentUserSubject.next(info);
        this.token = token;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

export class AuthServiceStub {
  login(email: string, password: string): Observable<void> {
    return of(null);
  }

  logout() {
  }

}


