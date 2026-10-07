import { EvolutionCondition, EvolutionStage } from '@pokedex/domain';
import { ChainLinkResponse, EvolutionDetailResponse } from './pokeapi.types';

export const ARTWORK_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// A API guarda o id só dentro da URL do recurso: .../pokemon-species/25/
export const idFromUrl = (url: string) => Number(url.match(/\/(\d+)\/?$/)?.[1]);

export function evolutionCondition(detail: EvolutionDetailResponse | undefined): EvolutionCondition | null {
  if (!detail) return null;
  if (detail.min_level) return { kind: 'level', level: detail.min_level };
  if (detail.item) return { kind: 'item', item: detail.item.name };
  if (detail.min_happiness) return { kind: 'friendship' };
  return detail.trigger ? { kind: 'trigger', trigger: detail.trigger.name } : null;
}

function toStage(link: ChainLinkResponse): EvolutionStage {
  const id = idFromUrl(link.species.url);
  return { id, name: link.species.name, image: `${ARTWORK_URL}/${id}.png`, condition: evolutionCondition(link.evolution_details[0]) };
}

// A cadeia é uma árvore; a tela mostra uma coluna por etapa.
export function toEvolutionStages(root: ChainLinkResponse): EvolutionStage[][] {
  const stages: EvolutionStage[][] = [];
  for (let level = [root]; level.length; level = level.flatMap(link => link.evolves_to)) {
    stages.push(level.map(toStage));
  }
  return stages;
}
