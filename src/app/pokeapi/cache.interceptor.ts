import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

// A PokeAPI não muda entre uma visita e outra, então cada GET é guardado enquanto a página estiver aberta.
@Injectable({ providedIn: 'root' })
export class HttpGetCache {
  private readonly responses = new Map<string, HttpResponse<unknown>>();

  get(url: string) {
    return this.responses.get(url);
  }

  set(url: string, response: HttpResponse<unknown>) {
    this.responses.set(url, response);
  }
}

export const cacheInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.method !== 'GET') return next(request);
  const cache = inject(HttpGetCache);
  const cached = cache.get(request.urlWithParams);
  if (cached) return of(cached.clone());
  return next(request).pipe(
    tap(event => {
      if (event instanceof HttpResponse) cache.set(request.urlWithParams, event);
    }),
  );
};
