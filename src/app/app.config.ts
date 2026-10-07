import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePokeApi } from '@pokedex/data-access';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [providePokeApi(), provideRouter(routes, withComponentInputBinding())],
};
