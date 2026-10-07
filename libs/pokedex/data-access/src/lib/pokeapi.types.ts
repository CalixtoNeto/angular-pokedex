// Formato das respostas da PokeAPI, só com os campos que o app usa.

export interface NamedResource {
  name: string;
  url: string;
}

export interface RegionListResponse {
  results: NamedResource[];
}

export interface PokedexResponse {
  pokemon_entries: { pokemon_species: { name: string } }[];
}

export interface PokemonResponse {
  id: number;
  name: string;
  types: { type: { name: string } }[];
}
