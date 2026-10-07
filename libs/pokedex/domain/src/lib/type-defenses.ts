import { POKEMON_TYPES, PokemonType, TYPE_CHART } from './type-chart';

export interface TypeEffectiveness {
  type: PokemonType;
  multiplier: number;
}

export interface TypeDefenses {
  weak: TypeEffectiveness[];
  resistant: TypeEffectiveness[];
  immune: TypeEffectiveness[];
}

const isKnownType = (type: string): type is PokemonType => (POKEMON_TYPES as readonly string[]).includes(type);

// Quanto dano cada tipo de ataque causa num Pokémon com estes tipos: os multiplicadores se multiplicam.
export function typeDefenses(defendingTypes: string[]): TypeDefenses {
  const known = defendingTypes.filter(isKnownType);
  const all = POKEMON_TYPES.map(attacking => ({
    type: attacking,
    multiplier: known.reduce((total, defending) => total * (TYPE_CHART[attacking][defending] ?? 1), 1),
  }));
  return {
    weak: all.filter(({ multiplier }) => multiplier > 1),
    resistant: all.filter(({ multiplier }) => multiplier > 0 && multiplier < 1),
    immune: all.filter(({ multiplier }) => multiplier === 0),
  };
}
