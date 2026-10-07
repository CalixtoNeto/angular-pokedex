import { Pipe, PipeTransform } from '@angular/core';
import { PokemonType } from '@pokedex/domain';
import { titleCaseSlug } from '../format/format';

// Os 18 tipos são fixos: traduzidos aqui, sem pedir nada a mais à PokeAPI.
const TYPE_LABELS: Record<PokemonType, string> = {
  normal: $localize`:Pokémon type@@type.normal:Normal`,
  fire: $localize`:Pokémon type@@type.fire:Fire`,
  water: $localize`:Pokémon type@@type.water:Water`,
  electric: $localize`:Pokémon type@@type.electric:Electric`,
  grass: $localize`:Pokémon type@@type.grass:Grass`,
  ice: $localize`:Pokémon type@@type.ice:Ice`,
  fighting: $localize`:Pokémon type@@type.fighting:Fighting`,
  poison: $localize`:Pokémon type@@type.poison:Poison`,
  ground: $localize`:Pokémon type@@type.ground:Ground`,
  flying: $localize`:Pokémon type@@type.flying:Flying`,
  psychic: $localize`:Pokémon type@@type.psychic:Psychic`,
  bug: $localize`:Pokémon type@@type.bug:Bug`,
  rock: $localize`:Pokémon type@@type.rock:Rock`,
  ghost: $localize`:Pokémon type@@type.ghost:Ghost`,
  dragon: $localize`:Pokémon type@@type.dragon:Dragon`,
  dark: $localize`:Pokémon type@@type.dark:Dark`,
  steel: $localize`:Pokémon type@@type.steel:Steel`,
  fairy: $localize`:Pokémon type@@type.fairy:Fairy`,
};

const isKnown = (type: string): type is PokemonType => Object.hasOwn(TYPE_LABELS, type);

export const typeLabel = (type: string) => (isKnown(type) ? TYPE_LABELS[type] : titleCaseSlug(type));

@Pipe({ name: 'typeLabel' })
export class TypeLabelPipe implements PipeTransform {
  transform(type: string): string {
    return typeLabel(type);
  }
}
