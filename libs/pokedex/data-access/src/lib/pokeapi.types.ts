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

export interface PokemonDetailResponse extends PokemonResponse {
  height: number;
  weight: number;
  abilities: { is_hidden: boolean; ability: { name: string } }[];
  species: NamedResource;
  sprites: { other: { 'official-artwork': { front_default: string | null } } };
  stats: { base_stat: number; stat: { name: string } }[];
}

export interface SpeciesResponse {
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  // Em oitavos de fêmea; -1 quando a espécie não tem gênero.
  gender_rate: number;
  egg_groups: { name: string }[];
  evolution_chain: { url: string };
  genera: { genus: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export interface EvolutionDetailResponse {
  min_level: number | null;
  item: { name: string } | null;
  min_happiness: number | null;
  trigger: { name: string } | null;
}

export interface ChainLinkResponse {
  species: NamedResource;
  evolution_details: EvolutionDetailResponse[];
  evolves_to: ChainLinkResponse[];
}

export interface EvolutionChainResponse {
  chain: ChainLinkResponse;
}
