import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();

    if(myToken){
      request = request.clone({
        setHeaders: {Authorization: 'Bearer ' + myToken}
      })
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            alert("Your token has expired. Please login again.");
            this.router.navigate(['login']);
          }
        }
        return throwError(() => new Error("Error"))
      })
    );
  }
}
