import { filterByName } from './filter-by-name';

describe('filterByName', () => {
  const pokemons = [{ name: 'bulbasaur' }, { name: 'ivysaur' }, { name: 'charmander' }];

  it('filtra pelo nome sem diferenciar maiúsculas', () => {
    expect(filterByName(pokemons, 'SAUR')).toEqual([{ name: 'bulbasaur' }, { name: 'ivysaur' }]);
  });

  it('ignora espaços em volta do termo', () => {
    expect(filterByName(pokemons, '  char ')).toEqual([{ name: 'charmander' }]);
  });

  it('sem termo, devolve a lista inteira', () => {
    expect(filterByName(pokemons, '')).toBe(pokemons);
  });
});
