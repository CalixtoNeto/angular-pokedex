import { toPokemon, toRegion } from './pokemon';

describe('toPokemon', () => {
  const bulbasaur = { id: 1, name: 'bulbasaur', types: [{ slot: 1, type: { name: 'grass' } }, { slot: 2, type: { name: 'poison' } }] };

  it('guarda número, nome e os nomes dos tipos na ordem da API', () => {
    expect(toPokemon(bulbasaur)).toMatchObject({ id: 1, name: 'bulbasaur', types: ['grass', 'poison'] });
  });

  it('monta a imagem oficial com o número em 3 dígitos', () => {
    expect(toPokemon(bulbasaur).image).toBe('https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png');
    expect(toPokemon({ ...bulbasaur, id: 1025 }).image).toBe('https://assets.pokemon.com/assets/cms2/img/pokedex/detail/1025.png');
  });
});

describe('toRegion', () => {
  it('troca hífen por espaço no nome que aparece no botão', () => {
    expect(toRegion({ name: 'original-johto', url: 'https://pokeapi.co/api/v2/pokedex/3/' }))
      .toEqual({ label: 'original johto', url: 'https://pokeapi.co/api/v2/pokedex/3/' });
  });
});
