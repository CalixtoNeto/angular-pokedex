import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Pokemon, PokemonRepository, Region } from '@pokedex/domain';
import { PokemonListComponent } from './pokemon-list.component';
import { PokedexStore } from '../pokedex.store';

const POKEMONS: Record<string, Pokemon[]> = {
  kanto: [
    { id: 1, name: 'bulbasaur', image: '', types: ['grass'] },
    { id: 4, name: 'charmander', image: '', types: ['fire'] },
  ],
  'original-johto': [{ id: 152, name: 'chikorita', image: '', types: ['grass'] }],
};

class FakePokemonRepository extends PokemonRepository {
  regions(): Observable<Region[]> {
    return of([{ id: 'kanto', label: 'kanto' }, { id: 'original-johto', label: 'original johto' }]);
  }
  pokemonsOfRegion(regionId: string): Observable<Pokemon[]> {
    return of(POKEMONS[regionId] ?? []);
  }
}

describe('PokemonListComponent', () => {
  async function render() {
    TestBed.configureTestingModule({ providers: [{ provide: PokemonRepository, useClass: FakePokemonRepository }] });
    const fixture = TestBed.createComponent(PokemonListComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const cardNames = () => [...element.querySelectorAll('.card-title')].map(title => title.textContent?.trim());
    return { fixture, element, cardNames };
  }

  it('mostra um botão por região, com o rótulo em maiúsculas iniciais', async () => {
    const { element } = await render();
    expect([...element.querySelectorAll('button')].map(b => b.textContent?.trim())).toEqual(['Kanto', 'Original Johto']);
  });

  it('clicar numa região troca a lista', async () => {
    const { fixture, element, cardNames } = await render();
    expect(cardNames()).toEqual(['Bulbasaur', 'Charmander']);
    element.querySelectorAll('button')[1]?.click();
    await fixture.whenStable();
    expect(cardNames()).toEqual(['Chikorita']);
  });

  it('digitar na busca filtra os cards', async () => {
    const { fixture, element, cardNames } = await render();
    const search = element.querySelector('input') as HTMLInputElement;
    search.value = 'char';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(TestBed.inject(PokedexStore).search()).toBe('char');
    expect(cardNames()).toEqual(['Charmander']);
  });
});
