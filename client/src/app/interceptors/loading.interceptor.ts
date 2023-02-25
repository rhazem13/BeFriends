import { BusyService } from './../services/busy.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private count = 0;

  constructor(private busyService: BusyService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.busyService.isLoading.next(true);
    this.count++;
    return next.handle(request).pipe(
      finalize(()=>{
        this.count--;
        if(this.count === 0){
          this.busyService.isLoading.next(false);
        }
      })
    );
  }
}
