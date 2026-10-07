import { ApplicationConfig } from '@angular/core';
import { providePokeApi } from '@pokedex/data-access';

export const appConfig: ApplicationConfig = {
  providers: [providePokeApi()],
};
