import { BaseStat, GenderRatio, PokemonDetail, Rarity, StatName } from '@pokedex/domain';
import { EvolutionChainResponse, PokemonDetailResponse, SpeciesResponse } from './pokeapi.types';
import { ARTWORK_URL, toEvolutionStages } from './pokeapi-evolution.mappers';

export { evolutionCondition } from './pokeapi-evolution.mappers';

const english = <T extends { language: { name: string } }>(entries: T[]) => entries.find(entry => entry.language.name === 'en');

// Os textos vêm dos cartuchos antigos: quebras de linha fixas, \f entre páginas e "POKéMON" em maiúsculas.
const cleanFlavorText = (text: string) => text.replace(/[\n\f­]+/g, ' ').replace(/POKéMON/g, 'Pokémon').replace(/\s+/g, ' ').trim();

function rarityOf(species: SpeciesResponse): Rarity | null {
  if (species.is_mythical) return 'mythical';
  if (species.is_legendary) return 'legendary';
  return species.is_baby ? 'baby' : null;
}

function genderOf({ gender_rate }: SpeciesResponse): GenderRatio | null {
  if (gender_rate < 0) return null;
  const female = (gender_rate / 8) * 100;
  return { male: 100 - female, female };
}

const toStat = ({ base_stat, stat }: PokemonDetailResponse['stats'][number]): BaseStat =>
  ({ name: stat.name as StatName, value: base_stat });

export function toPokemonDetail(pokemon: PokemonDetailResponse, species: SpeciesResponse, chain: EvolutionChainResponse): PokemonDetail {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other['official-artwork'].front_default ?? `${ARTWORK_URL}/${pokemon.id}.png`,
    types: pokemon.types.map(({ type }) => type.name),
    genus: english(species.genera)?.genus ?? '',
    description: cleanFlavorText(english(species.flavor_text_entries)?.flavor_text ?? ''),
    heightInMeters: pokemon.height / 10,
    weightInKilograms: pokemon.weight / 10,
    abilities: pokemon.abilities.map(({ is_hidden, ability }) => ({ name: ability.name, hidden: is_hidden })),
    stats: pokemon.stats.map(toStat),
    eggGroups: species.egg_groups.map(({ name }) => name),
    gender: genderOf(species),
    rarity: rarityOf(species),
    evolution: toEvolutionStages(chain.chain),
  };
}
