// PokeAPI simulada. As respostas de Pokémon, espécie e cadeia de evolução são as reais, recortadas do
// espelho PokeAPI/api-data (libs/pokedex/data-access/src/testing/pokeapi); a lista de regiões é montada aqui.
import { Page, Route } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://pokeapi.co/api/v2';
const FIXTURES = join(__dirname, '../../libs/pokedex/data-access/src/testing/pokeapi');

const REGIOES = [
  { name: 'national', url: `${API}/pokedex/1/` },
  { name: 'kanto', url: `${API}/pokedex/2/` },
  { name: 'original-johto', url: `${API}/pokedex/3/` },
];

const POKEDEX: Record<string, string[]> = {
  national: ['bulbasaur', 'chikorita'],
  kanto: ['bulbasaur', 'ivysaur', 'charmander'],
  'original-johto': ['chikorita', 'cyndaquil'],
};

// O primeiro da lista responde por último: a ordem final tem de seguir a Pokédex, não a rede.
const ATRASO_MS: Record<string, number> = { bulbasaur: 400, charmander: 100 };

const PNG_1X1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const entrada = (nome: string, i: number) => ({ entry_number: i + 1, pokemon_species: { name: nome, url: '' } });

function fixture(nome: string): unknown | undefined {
  const arquivo = join(FIXTURES, `${nome}.json`);
  return existsSync(arquivo) ? JSON.parse(readFileSync(arquivo, 'utf8')) : undefined;
}

export interface PokeApiFalsa {
  pedidosDeDetalhe: string[];
}

export async function simularPokeApi(page: Page): Promise<PokeApiFalsa> {
  const falsa: PokeApiFalsa = { pedidosDeDetalhe: [] };
  const imagem = (route: Route) => route.fulfill({ contentType: 'image/png', body: PNG_1X1 });
  await page.route('https://assets.pokemon.com/**', imagem);
  await page.route('https://raw.githubusercontent.com/**', imagem);
  await page.route(`${API}/**`, route => responder(route, falsa));
  return falsa;
}

async function responder(route: Route, falsa: PokeApiFalsa) {
  const caminho = new URL(route.request().url()).pathname.replace('/api/v2/', '');
  const [recurso, chave] = caminho.split('/');
  if (caminho === 'pokedex/') return route.fulfill({ json: { count: REGIOES.length, results: REGIOES } });
  if (recurso === 'pokedex' && chave && POKEDEX[chave]) {
    return route.fulfill({ json: { name: chave, pokemon_entries: POKEDEX[chave].map(entrada) } });
  }
  if (recurso === 'pokemon' && chave) {
    falsa.pedidosDeDetalhe.push(chave);
    await new Promise(r => setTimeout(r, ATRASO_MS[chave] ?? 0));
  }
  const prefixo = { pokemon: 'pokemon', 'pokemon-species': 'species', 'evolution-chain': 'evolution-chain' }[recurso ?? ''];
  const corpo = prefixo && chave ? fixture(`${prefixo}-${chave}`) : undefined;
  return corpo ? route.fulfill({ json: corpo }) : route.fulfill({ status: 404, json: {} });
}
