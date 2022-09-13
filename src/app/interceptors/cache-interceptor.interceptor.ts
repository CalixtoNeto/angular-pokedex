import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptorInterceptor implements HttpInterceptor {
  private cache = new Map<String, any>();

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    if (cachedResponse) {
      console.log('Resposta em cache');
      return of(cachedResponse);
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.url, event);
        }
      })
    );
  }
}
