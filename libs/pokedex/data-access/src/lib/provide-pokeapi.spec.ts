import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { PokemonRepository } from '@pokedex/domain';
import { providePokeApi } from './provide-pokeapi';
import { PokeApiPokemonRepository } from './pokeapi-pokemon.repository';

describe('providePokeApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [providePokeApi(), provideHttpClientTesting()] });
  });

  it('liga o contrato do domínio à implementação da PokeAPI', () => {
    expect(TestBed.inject(PokemonRepository)).toBeInstanceOf(PokeApiPokemonRepository);
  });

  it('registra o cache de GET no HttpClient', async () => {
    const http = TestBed.inject(HttpClient);
    const backend = TestBed.inject(HttpTestingController);
    const first = firstValueFrom(http.get('/pokemon/mew'));
    backend.expectOne('/pokemon/mew').flush({ id: 151 });
    await first;
    expect(await firstValueFrom(http.get('/pokemon/mew'))).toEqual({ id: 151 });
    backend.verify();
  });
});
