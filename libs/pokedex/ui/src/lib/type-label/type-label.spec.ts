import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { POKEMON_TYPES } from '@pokedex/domain';
import { TypeLabelPipe, typeLabel } from './type-label';

describe('typeLabel', () => {
  it('dá o nome de cada tipo no idioma do site (no teste, o de origem: inglês)', () => {
    expect(['grass', 'poison', 'psychic'].map(typeLabel)).toEqual(['Grass', 'Poison', 'Psychic']);
  });

  it('todos os tipos da tabela têm nome traduzível', () => {
    expect(POKEMON_TYPES.map(typeLabel).every(label => label.length > 0)).toBe(true);
  });

  it('um tipo que o app não conhece aparece com o nome da API', () => {
    expect(typeLabel('stellar')).toBe('Stellar');
  });
});

describe('TypeLabelPipe', () => {
  @Component({ template: '{{ "fire" | typeLabel }}', imports: [TypeLabelPipe] })
  class HostComponent {}

  it('usa o mesmo nome no template', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toBe('Fire');
  });
});
