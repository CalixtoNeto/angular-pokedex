import { typeDefenses } from './type-defenses';

const listed = (types: string[]) => {
  const defenses = typeDefenses(types);
  const format = (list: { type: string; multiplier: number }[]) => list.map(({ type, multiplier }) => `${type} ${multiplier}`);
  return { weak: format(defenses.weak), resistant: format(defenses.resistant), immune: format(defenses.immune) };
};

describe('typeDefenses', () => {
  it('multiplica a efetividade dos dois tipos (Bulbasaur: planta e veneno)', () => {
    expect(listed(['grass', 'poison'])).toEqual({
      weak: ['fire 2', 'ice 2', 'flying 2', 'psychic 2'],
      resistant: ['water 0.5', 'electric 0.5', 'grass 0.25', 'fighting 0.5', 'fairy 0.5'],
      immune: [],
    });
  });

  it('chega a ×4 e a imunidade quando os tipos se somam (Charizard: fogo e voador)', () => {
    const { weak, immune } = listed(['fire', 'flying']);
    expect(weak).toEqual(['water 2', 'electric 2', 'rock 4']);
    expect(immune).toEqual(['ground 0']);
  });

  it('lista as imunidades de um fantasma (Gengar: fantasma e veneno)', () => {
    expect(listed(['ghost', 'poison']).immune).toEqual(['normal 0', 'fighting 0']);
  });

  it('funciona com um tipo só', () => {
    expect(listed(['normal'])).toEqual({ weak: ['fighting 2'], resistant: [], immune: ['ghost 0'] });
  });

  it('ignora tipos que não estão na tabela', () => {
    expect(listed(['normal', 'shadow'])).toEqual(listed(['normal']));
  });
});
