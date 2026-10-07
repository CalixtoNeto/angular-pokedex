// Respostas fixas no lugar da PokeAPI, no mesmo formato da API real (só com os campos que o app usa).
import { Page, Route } from '@playwright/test';

const API = 'https://pokeapi.co/api/v2';

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

const POKEMON: Record<string, { id: number; tipos: string[]; atrasoMs: number }> = {
  // O primeiro da lista responde por último: a ordem final tem de seguir a Pokédex, não a rede.
  bulbasaur: { id: 1, tipos: ['grass', 'poison'], atrasoMs: 400 },
  ivysaur: { id: 2, tipos: ['grass', 'poison'], atrasoMs: 0 },
  charmander: { id: 4, tipos: ['fire'], atrasoMs: 100 },
  chikorita: { id: 152, tipos: ['grass'], atrasoMs: 0 },
  cyndaquil: { id: 155, tipos: ['fire'], atrasoMs: 0 },
};

const PNG_1X1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

const entrada = (nome: string, i: number) => ({ entry_number: i + 1, pokemon_species: { name: nome, url: '' } });
const detalhe = (nome: string) => ({
  id: POKEMON[nome].id,
  name: nome,
  types: POKEMON[nome].tipos.map((tipo, i) => ({ slot: i + 1, type: { name: tipo, url: '' } })),
});

export interface PokeApiFalsa {
  pedidosDeDetalhe: string[];
}

export async function simularPokeApi(page: Page): Promise<PokeApiFalsa> {
  const falsa: PokeApiFalsa = { pedidosDeDetalhe: [] };
  await page.route('https://assets.pokemon.com/**', route => route.fulfill({ contentType: 'image/png', body: PNG_1X1 }));
  await page.route(`${API}/**`, route => responder(route, falsa));
  return falsa;
}

async function responder(route: Route, falsa: PokeApiFalsa) {
  const url = new URL(route.request().url());
  const regiao = url.pathname.match(/\/pokedex\/([a-z-]+)\/$/)?.[1];
  const pokemon = url.pathname.match(/\/pokemon\/([a-z-]+)$/)?.[1];
  if (url.pathname === '/api/v2/pokedex/') return route.fulfill({ json: { count: REGIOES.length, results: REGIOES } });
  if (regiao && POKEDEX[regiao]) return route.fulfill({ json: { name: regiao, pokemon_entries: POKEDEX[regiao].map(entrada) } });
  if (pokemon && POKEMON[pokemon]) {
    falsa.pedidosDeDetalhe.push(pokemon);
    await new Promise(r => setTimeout(r, POKEMON[pokemon].atrasoMs));
    return route.fulfill({ json: detalhe(pokemon) });
  }
  return route.fulfill({ status: 404, json: {} });
}
