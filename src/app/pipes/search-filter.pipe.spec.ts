import { SearchFilterPipe } from './search-filter.pipe';

describe('SearchFilterPipe', () => {
  const filtrar = (lista: unknown, termo?: string) => new SearchFilterPipe().transform(lista, termo);
  const pokemons = [{ name: 'bulbasaur' }, { name: 'ivysaur' }, { name: 'charmander' }];

  it('filtra pelo nome sem diferenciar maiúsculas', () => {
    expect(filtrar(pokemons, 'SAUR')).toEqual([{ name: 'bulbasaur' }, { name: 'ivysaur' }]);
  });

  it('sem termo, devolve a lista inteira', () => {
    expect(filtrar(pokemons, '')).toBe(pokemons);
  });

  it('sem lista, devolve null', () => {
    expect(filtrar(undefined, 'char')).toBeNull();
  });
});
