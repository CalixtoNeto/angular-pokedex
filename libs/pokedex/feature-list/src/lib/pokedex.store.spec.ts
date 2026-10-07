import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, Subject, of } from 'rxjs';
import { Pokemon, PokemonDetail, PokemonRepository, Region } from '@pokedex/domain';
import { PokedexStore } from './pokedex.store';

const pokemon = (id: number, name: string): Pokemon => ({ id, name, image: '', types: ['grass'] });

// Repositório em memória: o store só conhece o contrato, então o teste não precisa de HTTP.
class FakePokemonRepository extends PokemonRepository {
  readonly streams = new Map<string, Subject<Pokemon[]>>();
  regions(): Observable<Region[]> {
    return of([{ id: 'kanto', label: 'kanto' }, { id: 'original-johto', label: 'original johto' }]);
  }
  pokemonsOfRegion(regionId: string): Observable<Pokemon[]> {
    const stream = new Subject<Pokemon[]>();
    this.streams.set(regionId, stream);
    return stream;
  }
  detail(): Observable<PokemonDetail> {
    return EMPTY;
  }
}

describe('PokedexStore', () => {
  let store: PokedexStore;
  let repository: FakePokemonRepository;

  // O rxResource publica o valor uma volta do event loop depois da emissão.
  const settle = async () => {
    await new Promise(resolve => setTimeout(resolve));
    TestBed.tick();
  };
  const names = () => store.visiblePokemons().map(p => p.name);
  const streamOf = (regionId: string) => {
    const stream = repository.streams.get(regionId);
    if (!stream) throw new Error(`o store não pediu a região ${regionId}`);
    return stream;
  };

  beforeEach(async () => {
    repository = new FakePokemonRepository();
    TestBed.configureTestingModule({ providers: [{ provide: PokemonRepository, useValue: repository }] });
    store = TestBed.inject(PokedexStore);
    await settle();
  });

  it('expõe as regiões do repositório', () => {
    expect(store.regions().map(r => r.id)).toEqual(['kanto', 'original-johto']);
  });

  it('abre em Kanto e mostra a lista à medida que o repositório emite', async () => {
    streamOf('kanto').next([pokemon(1, 'bulbasaur')]);
    await settle();
    expect(names()).toEqual(['bulbasaur']);
    streamOf('kanto').next([pokemon(1, 'bulbasaur'), pokemon(4, 'charmander')]);
    await settle();
    expect(names()).toEqual(['bulbasaur', 'charmander']);
  });

  it('a busca filtra a lista visível', async () => {
    streamOf('kanto').next([pokemon(1, 'bulbasaur'), pokemon(4, 'charmander')]);
    store.search.set('CHAR');
    await settle();
    expect(names()).toEqual(['charmander']);
  });

  it('trocar de região deixa de ouvir a região anterior', async () => {
    const kanto = streamOf('kanto');
    store.selectRegion('original-johto');
    await settle();
    expect(kanto.observed).toBe(false);
    streamOf('original-johto').next([pokemon(152, 'chikorita')]);
    await settle();
    expect(names()).toEqual(['chikorita']);
  });
});
