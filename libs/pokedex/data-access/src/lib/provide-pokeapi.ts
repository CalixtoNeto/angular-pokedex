import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PokemonRepository } from '@pokedex/domain';
import { cacheInterceptor } from './cache.interceptor';
import { PokeApiPokemonRepository } from './pokeapi-pokemon.repository';

// Liga o contrato do domínio à implementação que fala com a PokeAPI. Só o app chama isto.
export function providePokeApi(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(withInterceptors([cacheInterceptor])),
    { provide: PokemonRepository, useClass: PokeApiPokemonRepository },
  ];
}
