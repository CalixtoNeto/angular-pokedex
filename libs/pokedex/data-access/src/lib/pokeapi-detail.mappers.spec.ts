// Testes de contrato: as entradas são respostas reais da PokeAPI (espelho PokeAPI/api-data), recortadas.
import { toPokemonDetail, evolutionCondition } from './pokeapi-detail.mappers';
import { EvolutionChainResponse, PokemonDetailResponse, SpeciesResponse } from './pokeapi.types';
import bulbasaur from '../testing/pokeapi/pokemon-bulbasaur.json';
import bulbasaurSpecies from '../testing/pokeapi/species-bulbasaur.json';
import bulbasaurChain from '../testing/pokeapi/evolution-chain-1.json';
import mewtwo from '../testing/pokeapi/pokemon-mewtwo.json';
import mewtwoSpecies from '../testing/pokeapi/species-mewtwo.json';
import mewtwoChain from '../testing/pokeapi/evolution-chain-77.json';
import mew from '../testing/pokeapi/pokemon-mew.json';
import mewSpecies from '../testing/pokeapi/species-mew.json';
import mewChain from '../testing/pokeapi/evolution-chain-78.json';
import pichu from '../testing/pokeapi/pokemon-pichu.json';
import pichuSpecies from '../testing/pokeapi/species-pichu.json';
import pikachuChain from '../testing/pokeapi/evolution-chain-10.json';
import eeveeChain from '../testing/pokeapi/evolution-chain-67.json';

const detail = (pokemon: unknown, species: unknown, chain: unknown) =>
  toPokemonDetail(pokemon as PokemonDetailResponse, species as SpeciesResponse, chain as EvolutionChainResponse);
const ARTWORK = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

describe('toPokemonDetail (contrato com a PokeAPI)', () => {
  const bulba = detail(bulbasaur, bulbasaurSpecies, bulbasaurChain);

  it('converte medidas de decímetros e hectogramas', () => {
    expect(bulba).toMatchObject({ id: 1, name: 'bulbasaur', heightInMeters: 0.7, weightInKilograms: 6.9 });
  });

  it('usa a arte oficial que a própria API indica', () => {
    expect(bulba.image).toBe(`${ARTWORK}/1.png`);
  });

  it('traz espécie, descrição limpa, tipos, habilidades e grupos de ovo', () => {
    expect(bulba.genus).toBe('Seed Pokémon');
    expect(bulba.description).toBe('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.');
    expect(bulba.types).toEqual(['grass', 'poison']);
    expect(bulba.abilities).toEqual([{ name: 'overgrow', hidden: false }, { name: 'chlorophyll', hidden: true }]);
    expect(bulba.eggGroups).toEqual(['monster', 'plant']);
  });

  it('traz os seis stats base na ordem da API', () => {
    expect(bulba.stats.map(s => `${s.name} ${s.value}`)).toEqual([
      'hp 45', 'attack 49', 'defense 49', 'special-attack 65', 'special-defense 65', 'speed 45',
    ]);
  });

  it('converte gender_rate (oitavos de fêmea) em percentuais', () => {
    expect(bulba.gender).toEqual({ male: 87.5, female: 12.5 });
    expect(detail(mewtwo, mewtwoSpecies, mewtwoChain).gender).toBeNull();
  });

  it('marca a raridade: lendário, mítico, bebê ou nenhuma', () => {
    expect(bulba.rarity).toBeNull();
    expect(detail(mewtwo, mewtwoSpecies, mewtwoChain).rarity).toBe('legendary');
    expect(detail(mew, mewSpecies, mewChain).rarity).toBe('mythical');
    expect(detail(pichu, pichuSpecies, pikachuChain).rarity).toBe('baby');
  });

  it('achata a cadeia de evolução por etapa, com a condição de cada uma', () => {
    expect(bulba.evolution).toEqual([
      [{ id: 1, name: 'bulbasaur', image: `${ARTWORK}/1.png`, condition: null }],
      [{ id: 2, name: 'ivysaur', image: `${ARTWORK}/2.png`, condition: 'Lv. 16' }],
      [{ id: 3, name: 'venusaur', image: `${ARTWORK}/3.png`, condition: 'Lv. 32' }],
    ]);
  });

  it('evolução por amizade e por item', () => {
    const stages = detail(pichu, pichuSpecies, pikachuChain).evolution.map(stage => stage.map(s => [s.name, s.condition]));
    expect(stages).toEqual([[['pichu', null]], [['pikachu', 'Friendship']], [['raichu', 'Thunder Stone']]]);
  });

  it('evoluções ramificadas ficam lado a lado na mesma etapa (Eevee)', () => {
    const stages = detail(bulbasaur, bulbasaurSpecies, eeveeChain).evolution;
    expect(stages[0]?.map(s => s.name)).toEqual(['eevee']);
    expect(stages[1]?.length).toBe(8);
    expect(stages[1]?.find(s => s.name === 'vaporeon')?.condition).toBe('Water Stone');
  });
});

describe('toPokemonDetail com dados incompletos', () => {
  const semArte = { ...bulbasaur, sprites: { other: { 'official-artwork': { front_default: null } } } };
  const semIngles = { ...bulbasaurSpecies, genera: [], flavor_text_entries: [] };

  it('sem arte oficial na resposta, monta a URL da arte pelo número', () => {
    expect(detail(semArte, bulbasaurSpecies, bulbasaurChain).image).toBe(`${ARTWORK}/1.png`);
  });

  it('sem textos em inglês, espécie e descrição ficam vazias em vez de quebrar', () => {
    expect(detail(bulbasaur, semIngles, bulbasaurChain)).toMatchObject({ genus: '', description: '' });
  });
});

describe('evolutionCondition', () => {
  it('nível, item, amizade e, sem detalhe conhecido, o gatilho', () => {
    expect(evolutionCondition({ min_level: 36, item: null, min_happiness: null, trigger: { name: 'level-up' } })).toBe('Lv. 36');
    expect(evolutionCondition({ min_level: null, item: { name: 'moon-stone' }, min_happiness: null, trigger: { name: 'use-item' } }))
      .toBe('Moon Stone');
    expect(evolutionCondition({ min_level: null, item: null, min_happiness: 160, trigger: { name: 'level-up' } })).toBe('Friendship');
    expect(evolutionCondition({ min_level: null, item: null, min_happiness: null, trigger: { name: 'trade' } })).toBe('Trade');
  });

  it('sem detalhe nenhum, não há condição (a primeira etapa)', () => {
    expect(evolutionCondition(undefined)).toBeNull();
  });
});
