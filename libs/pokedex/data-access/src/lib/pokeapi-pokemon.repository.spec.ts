import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Pokemon, Region } from '@pokedex/domain';
import { POKEAPI_URL, PokeApiPokemonRepository } from './pokeapi-pokemon.repository';

const entries = (...names: string[]) => ({ pokemon_entries: names.map(name => ({ pokemon_species: { name } })) });
const details = (id: number, name: string) => ({ id, name, types: [{ slot: 1, type: { name: 'grass' } }] });

describe('PokeApiPokemonRepository', () => {
  let repository: PokeApiPokemonRepository;
  let backend: HttpTestingController;

  const respondPokemon = (id: number, name: string) => backend.expectOne(`${POKEAPI_URL}/pokemon/${name}`).flush(details(id, name));

  function collect<T>(observable: { subscribe: (next: (value: T) => void) => { unsubscribe(): void } }) {
    const emitted: T[] = [];
    const subscription = observable.subscribe(value => emitted.push(value));
    return { emitted, last: () => emitted.at(-1), subscription };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PokeApiPokemonRepository],
    });
    repository = TestBed.inject(PokeApiPokemonRepository);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('lista as regiões pelo nome da Pokédex', () => {
    const regions = collect<Region[]>(repository.regions());
    backend.expectOne(`${POKEAPI_URL}/pokedex/?offset=0&limit=100`)
      .flush({ results: [{ name: 'original-johto', url: `${POKEAPI_URL}/pokedex/3/` }] });
    expect(regions.last()).toEqual([{ id: 'original-johto', label: 'original johto' }]);
  });

  it('mantém a ordem da Pokédex mesmo com respostas fora de ordem', () => {
    const pokemons = collect<Pokemon[]>(repository.pokemonsOfRegion('kanto'));
    backend.expectOne(`${POKEAPI_URL}/pokedex/kanto/`).flush(entries('bulbasaur', 'ivysaur', 'charmander'));
    respondPokemon(4, 'charmander');
    respondPokemon(2, 'ivysaur');
    expect(pokemons.last()?.map(p => p.name)).toEqual(['ivysaur', 'charmander']);
    respondPokemon(1, 'bulbasaur');
    expect(pokemons.last()?.map(p => p.name)).toEqual(['bulbasaur', 'ivysaur', 'charmander']);
  });

  it('um Pokémon que a API não encontra fica de fora sem derrubar a lista', () => {
    const pokemons = collect<Pokemon[]>(repository.pokemonsOfRegion('hoenn'));
    backend.expectOne(`${POKEAPI_URL}/pokedex/hoenn/`).flush(entries('deoxys', 'jirachi'));
    backend.expectOne(`${POKEAPI_URL}/pokemon/deoxys`).flush({}, { status: 404, statusText: 'Not Found' });
    respondPokemon(385, 'jirachi');
    expect(pokemons.last()?.map(p => p.name)).toEqual(['jirachi']);
  });

  it('cancelar a inscrição cancela os pedidos pendentes', () => {
    const pokemons = collect<Pokemon[]>(repository.pokemonsOfRegion('kanto'));
    backend.expectOne(`${POKEAPI_URL}/pokedex/kanto/`).flush(entries('bulbasaur'));
    const pending = backend.expectOne(`${POKEAPI_URL}/pokemon/bulbasaur`);
    pokemons.subscription.unsubscribe();
    expect(pending.cancelled).toBe(true);
  });
});
