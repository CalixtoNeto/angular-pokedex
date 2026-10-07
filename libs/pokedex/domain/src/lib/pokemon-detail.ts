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

export interface EvolutionStage {
  id: number;
  name: string;
  image: string;
  // Como se chega a esta etapa: "Lv. 16", "Thunder Stone", "Friendship". A primeira etapa não tem.
  condition: string | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: string[];
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
