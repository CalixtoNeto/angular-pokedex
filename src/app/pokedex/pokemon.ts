import { NamedResource, PokemonResponse } from '../pokeapi/pokeapi.types';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface Region {
  label: string;
  url: string;
}

const OFFICIAL_ARTWORK_URL = 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail';

export function toPokemon(response: PokemonResponse): Pokemon {
  return {
    id: response.id,
    name: response.name,
    image: `${OFFICIAL_ARTWORK_URL}/${String(response.id).padStart(3, '0')}.png`,
    types: response.types.map(({ type }) => type.name),
  };
}

export function toRegion({ name, url }: NamedResource): Region {
  return { label: name.replaceAll('-', ' '), url };
}
