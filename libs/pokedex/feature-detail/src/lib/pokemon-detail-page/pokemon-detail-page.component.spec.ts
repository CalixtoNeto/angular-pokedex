import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { Pokemon, PokemonDetail, PokemonRepository, Region } from '@pokedex/domain';
import { PokemonDetailPageComponent } from './pokemon-detail-page.component';

const MEWTWO: PokemonDetail = {
  id: 150, name: 'mewtwo', image: '/150.png', types: ['psychic'], genus: 'Genetic Pokémon', description: 'Created.',
  heightInMeters: 2, weightInKilograms: 122, abilities: [{ name: 'pressure', hidden: false }],
  stats: [{ name: 'hp', value: 106 }], eggGroups: ['no-eggs'], gender: null, rarity: 'legendary',
  evolution: [[{ id: 150, name: 'mewtwo', image: '/150.png', condition: null }]],
};

class FakePokemonRepository extends PokemonRepository {
  readonly requests = new Map<string, Subject<PokemonDetail>>();
  regions(): Observable<Region[]> { return new Subject(); }
  pokemonsOfRegion(): Observable<Pokemon[]> { return new Subject(); }
  detail(name: string): Observable<PokemonDetail> {
    if (name === 'missingno') return throwError(() => new Error('404'));
    const request = new Subject<PokemonDetail>();
    this.requests.set(name, request);
    return request;
  }
}

describe('PokemonDetailPageComponent', () => {
  async function render(name: string) {
    const repository = new FakePokemonRepository();
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: PokemonRepository, useValue: repository }] });
    const fixture = TestBed.createComponent(PokemonDetailPageComponent);
    fixture.componentRef.setInput('name', name);
    // O pedido fica pendente até o teste responder; whenStable() esperaria para sempre.
    const settle = async () => {
      await new Promise(resolve => setTimeout(resolve));
      fixture.detectChanges();
    };
    await settle();
    const element = fixture.nativeElement as HTMLElement;
    const respond = async (detail: PokemonDetail) => {
      repository.requests.get(name)?.next(detail);
      await settle();
    };
    const tab = (label: string) => [...element.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find(b => b.textContent?.trim() === label);
    return { settle, element, respond, tab };
  }

  it('mostra que está carregando enquanto o repositório não responde', async () => {
    const { element } = await render('mewtwo');
    expect(element.textContent).toContain('Loading');
  });

  it('mostra nome, número, tipos e raridade, com a cor do primeiro tipo', async () => {
    const { element, respond } = await render('mewtwo');
    await respond(MEWTWO);
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Mewtwo');
    expect(element.querySelector('.number')?.textContent?.trim()).toBe('#150');
    expect(element.querySelector('.detail-header')?.classList).toContain('bg-psychic');
    expect(element.querySelector('.rarity')?.textContent?.trim()).toBe('Legendary');
  });

  it('abre na aba About e troca de aba ao clicar', async () => {
    const { settle, element, respond, tab } = await render('mewtwo');
    await respond(MEWTWO);
    expect(tab('About')?.getAttribute('aria-selected')).toBe('true');
    expect(element.querySelector('app-pokemon-about')).not.toBeNull();
    tab('Base Stats')?.click();
    await settle();
    expect(tab('Base Stats')?.getAttribute('aria-selected')).toBe('true');
    expect(element.querySelector('app-stat-bars')).not.toBeNull();
    tab('Defenses')?.click();
    await settle();
    expect(element.querySelector('[data-defense="weak"]')?.textContent).toContain('Bug');
  });

  it('avisa quando o Pokémon não existe', async () => {
    const { element } = await render('missingno');
    expect(element.textContent).toContain('Pokémon not found');
  });
});
