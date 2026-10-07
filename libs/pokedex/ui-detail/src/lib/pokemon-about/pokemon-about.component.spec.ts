import { TestBed } from '@angular/core/testing';
import { PokemonDetail } from '@pokedex/domain';
import { PokemonAboutComponent } from './pokemon-about.component';

const BULBASAUR: PokemonDetail = {
  id: 1, name: 'bulbasaur', image: '', types: ['grass', 'poison'], genus: 'Seed Pokémon',
  description: 'A strange seed was planted on its back at birth.', heightInMeters: 0.7, weightInKilograms: 6.9,
  abilities: [{ name: 'overgrow', hidden: false }, { name: 'chlorophyll', hidden: true }],
  stats: [], eggGroups: ['monster', 'plant'], gender: { male: 87.5, female: 12.5 }, rarity: null, evolution: [],
};

describe('PokemonAboutComponent', () => {
  function render(detail: PokemonDetail) {
    const fixture = TestBed.createComponent(PokemonAboutComponent);
    fixture.componentRef.setInput('detail', detail);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  it('mostra espécie, descrição, medidas, habilidades e grupos de ovo', () => {
    const text = render(BULBASAUR);
    for (const expected of ['Seed Pokémon', 'A strange seed', '0.7 m', '6.9 kg', 'Overgrow, Chlorophyll (hidden)', 'Monster, Plant']) {
      expect(text).toContain(expected);
    }
  });

  it('mostra a proporção de gênero, ou que a espécie não tem gênero', () => {
    expect(render(BULBASAUR)).toContain('♂ 87.5%');
    expect(render(BULBASAUR)).toContain('♀ 12.5%');
    expect(render({ ...BULBASAUR, gender: null })).toContain('Genderless');
  });
});
