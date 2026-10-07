import { BaseStat, GenderRatio, PokemonDetail, Rarity, StatName } from '@pokedex/domain';
import { EvolutionChainResponse, PokemonDetailResponse, SpeciesResponse } from './pokeapi.types';
import { ARTWORK_URL, toEvolutionStages } from './pokeapi-evolution.mappers';
import { pokeApiLanguages, toLanguageTag } from './pokeapi-language';

export { evolutionCondition } from './pokeapi-evolution.mappers';

const inLanguage = <T extends { language: { name: string } }>(entries: T[], language: string) =>
  entries.find(entry => entry.language.name === language);

// Os textos vêm dos cartuchos antigos: quebras de linha fixas, \f entre páginas e "POKéMON" em maiúsculas.
const cleanFlavorText = (text: string) => text.replace(/[\n\f­]+/g, ' ').replace(/POKéMON/g, 'Pokémon').replace(/\s+/g, ' ').trim();

// Espécie e descrição saem do mesmo idioma: o primeiro da preferência que a PokeAPI tem para os dois.
function speciesTexts(species: SpeciesResponse, localeId: string) {
  const languages = pokeApiLanguages(localeId);
  const language = languages.find(l => inLanguage(species.genera, l) && inLanguage(species.flavor_text_entries, l)) ?? 'en';
  return {
    textLanguage: toLanguageTag(language),
    genus: inLanguage(species.genera, language)?.genus ?? '',
    description: cleanFlavorText(inLanguage(species.flavor_text_entries, language)?.flavor_text ?? ''),
  };
}

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

export function toPokemonDetail(
  pokemon: PokemonDetailResponse, species: SpeciesResponse, chain: EvolutionChainResponse, localeId = 'en',
): PokemonDetail {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other['official-artwork'].front_default ?? `${ARTWORK_URL}/${pokemon.id}.png`,
    types: pokemon.types.map(({ type }) => type.name),
    ...speciesTexts(species, localeId),
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
