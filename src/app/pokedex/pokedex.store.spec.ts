import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokedexStore } from './pokedex.store';
import { DEFAULT_REGION_URL, POKEAPI_URL, REGIONS_URL } from '../pokeapi/pokeapi.client';

const entries = (...names: string[]) => ({ pokemon_entries: names.map(name => ({ pokemon_species: { name } })) });
const details = (id: number, name: string) => ({ id, name, types: [{ slot: 1, type: { name: 'grass' } }] });
const JOHTO_URL = `${POKEAPI_URL}/pokedex/3/`;

describe('PokedexStore', () => {
  let store: PokedexStore;
  let backend: HttpTestingController;

  // O rxResource publica o valor uma volta do event loop depois da resposta.
  const settle = async () => {
    await new Promise(resolve => setTimeout(resolve));
    TestBed.tick();
  };
  const respondPokemon = (id: number, name: string) => backend.expectOne(`${POKEAPI_URL}/pokemon/${name}`).flush(details(id, name));
  const names = () => store.visiblePokemons().map(p => p.name);

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    store = TestBed.inject(PokedexStore);
    backend = TestBed.inject(HttpTestingController);
    await settle();
  });

  afterEach(() => backend.verify());

  it('carrega as regiões', async () => {
    backend.expectOne(REGIONS_URL).flush({ results: [{ name: 'original-johto', url: JOHTO_URL }] });
    backend.expectOne(DEFAULT_REGION_URL).flush(entries());
    await settle();
    expect(store.regions()).toEqual([{ label: 'original johto', url: JOHTO_URL }]);
  });

  it('abre em Kanto e mantém a ordem da Pokédex mesmo com respostas fora de ordem', async () => {
    backend.expectOne(REGIONS_URL).flush({ results: [] });
    backend.expectOne(DEFAULT_REGION_URL).flush(entries('bulbasaur', 'ivysaur', 'charmander'));
    respondPokemon(4, 'charmander');
    respondPokemon(2, 'ivysaur');
    await settle();
    expect(names()).toEqual(['ivysaur', 'charmander']);
    respondPokemon(1, 'bulbasaur');
    await settle();
    expect(names()).toEqual(['bulbasaur', 'ivysaur', 'charmander']);
  });

  it('um Pokémon que a API não encontra fica de fora sem derrubar a lista', async () => {
    backend.expectOne(REGIONS_URL).flush({ results: [] });
    backend.expectOne(DEFAULT_REGION_URL).flush(entries('deoxys', 'jirachi'));
    backend.expectOne(`${POKEAPI_URL}/pokemon/deoxys`).flush({}, { status: 404, statusText: 'Not Found' });
    respondPokemon(385, 'jirachi');
    await settle();
    expect(names()).toEqual(['jirachi']);
  });

  it('a busca filtra a lista visível', async () => {
    backend.expectOne(REGIONS_URL).flush({ results: [] });
    backend.expectOne(DEFAULT_REGION_URL).flush(entries('bulbasaur', 'charmander'));
    respondPokemon(1, 'bulbasaur');
    respondPokemon(4, 'charmander');
    store.search.set('CHAR');
    await settle();
    expect(names()).toEqual(['charmander']);
  });

  it('trocar de região cancela os pedidos da região anterior', async () => {
    backend.expectOne(REGIONS_URL).flush({ results: [] });
    backend.expectOne(DEFAULT_REGION_URL).flush(entries('bulbasaur'));
    const pendente = backend.expectOne(`${POKEAPI_URL}/pokemon/bulbasaur`);
    store.selectRegion(JOHTO_URL);
    await settle();
    expect(pendente.cancelled).toBe(true);
    backend.expectOne(JOHTO_URL).flush(entries('chikorita'));
    respondPokemon(152, 'chikorita');
    await settle();
    expect(names()).toEqual(['chikorita']);
  });
});
