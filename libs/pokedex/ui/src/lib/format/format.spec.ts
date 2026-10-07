import { formatMultiplier, pokedexNumber, titleCaseSlug } from './format';

describe('formatação', () => {
  it('número da Pokédex com 3 dígitos e #', () => {
    expect(pokedexNumber(1)).toBe('#001');
    expect(pokedexNumber(1025)).toBe('#1025');
  });

  it('multiplicador de dano com frações legíveis', () => {
    expect([4, 2, 0.5, 0.25, 0].map(formatMultiplier)).toEqual(['×4', '×2', '×½', '×¼', '×0']);
  });

  it('slug da API em palavras com inicial maiúscula', () => {
    expect(titleCaseSlug('no-eggs')).toBe('No Eggs');
    expect(titleCaseSlug('chlorophyll')).toBe('Chlorophyll');
  });
});
