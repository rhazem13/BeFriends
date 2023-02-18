import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackbar: MatSnackBar) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else if(typeof(error.error) === 'object'){
                this.snackbar.open(
                  error.statusText === 'OK' ? 'Bad Request' : error.statusText,
                  error.status,
                  { duration: 1500 }
                );
              }
              else {
                this.snackbar.open(error.error +" "+error.status,undefined,{duration: 1500});
              }
              break;
            case 401:
              this.snackbar.open(
                error.statusText === 'OK' ? 'Unauthorized' : error.statusText,
                error.status,
                { duration: 1500 }
              );
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.snackbar.open('Something unexpected went wrong', undefined, {
                duration: 1500,
              });
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
