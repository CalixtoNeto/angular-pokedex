export type Rarity = 'legendary' | 'mythical' | 'baby';

export type StatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export interface BaseStat {
  name: StatName;
  value: number;
}

export interface Ability {
  name: string;
  hidden: boolean;
}

// Percentuais. Espécies sem gênero (Mewtwo, Magnemite) ficam com gender = null.
export interface GenderRatio {
  male: number;
  female: number;
}

// Como se chega a uma etapa. É dado, não texto: a interface escreve "Lv. 16" ou "Nv. 16" conforme o idioma.
// item e trigger são os nomes da PokeAPI ("thunder-stone", "trade").
export type EvolutionCondition =
  | { kind: 'level'; level: number }
  | { kind: 'item'; item: string }
  | { kind: 'friendship' }
  | { kind: 'trigger'; trigger: string };

export interface EvolutionStage {
  id: number;
  name: string;
  image: string;
  // A primeira etapa não tem condição.
  condition: EvolutionCondition | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: string[];
  // Idioma (tag BCP 47) em que vieram genus e description. Pode não ser o do site quando a PokeAPI não tem a tradução.
  textLanguage: string;
  genus: string;
  description: string;
  heightInMeters: number;
  weightInKilograms: number;
  abilities: Ability[];
  stats: BaseStat[];
  eggGroups: string[];
  gender: GenderRatio | null;
  rarity: Rarity | null;
  // Uma lista por etapa; evoluções ramificadas (Eevee) ficam lado a lado na mesma etapa.
  evolution: EvolutionStage[][];
}
