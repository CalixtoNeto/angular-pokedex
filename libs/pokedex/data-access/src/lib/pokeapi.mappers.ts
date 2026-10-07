import { Pokemon, Region } from '@pokedex/domain';
import { NamedResource, PokemonResponse } from './pokeapi.types';

const OFFICIAL_ARTWORK_URL = 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail';

export function toPokemon(response: PokemonResponse): Pokemon {
  return {
    id: response.id,
    name: response.name,
    image: `${OFFICIAL_ARTWORK_URL}/${String(response.id).padStart(3, '0')}.png`,
    types: response.types.map(({ type }) => type.name),
  };
}

export function toRegion({ name }: NamedResource): Region {
  return { id: name, label: name.replaceAll('-', ' ') };
}
