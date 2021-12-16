import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { AuthService } from '@app/auth/providers/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      let error:string = '';

      if (err.status === 400) {
        error = err.error.data._form || err.statusText;
      }

      if (err.status === 401) {
        this.authService.logout();
        location.reload();
      }

      return throwError(error);
    }));
  }
}
