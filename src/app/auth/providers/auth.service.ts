import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

import { environment } from '@environments/environment';
import { User } from '@app/home/entietis/user';
import { AuthFormInfo } from '@app/auth/entities/auth-form-info';
import { RestService } from '@app/shared/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public token: string;
  public currentUser: Observable<User>;

  constructor(
    private rest: RestService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.token = localStorage.getItem('token');
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(user: AuthFormInfo): Observable<void> {
    return this.rest.restPOST(`${environment.apiUrl}public/login`, user)
      .pipe(tap(res => {
        const token = res['token'];
        const info = res['info'];

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


