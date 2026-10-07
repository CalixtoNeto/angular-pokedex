import { TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { toPokemon } from '../pokedex/pokemon';

describe('PokemonCardComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(PokemonCardComponent);
    fixture.componentRef.setInput('pokemon', toPokemon({ id: 1, name: 'bulbasaur', types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }] }));
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('mostra o nome com inicial maiúscula', () => {
    expect(render().querySelector('.card-title')?.textContent?.trim()).toBe('Bulbasaur');
  });

  it('mostra um selo por tipo, com a cor do tipo', () => {
    const selos = [...render().querySelectorAll('.badge')];
    expect(selos.map(s => s.textContent?.trim())).toEqual(['Grass', 'Poison']);
    expect(selos[0].classList).toContain('bg-grass');
  });

  it('carrega a imagem só quando ela chega perto da tela', () => {
    const imagem = render().querySelector('img')!;
    expect(imagem.getAttribute('loading')).toBe('lazy');
    expect(imagem.getAttribute('alt')).toBe('bulbasaur');
  });
});
