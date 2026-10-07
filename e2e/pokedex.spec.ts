// Comportamento da Pokédex visto de fora, num navegador de verdade e com a PokeAPI simulada.
// Não depende de como o app é escrito por dentro: vale para o Angular 12 e para o 22.
import { test, expect, Page } from '@playwright/test';
import { simularPokeApi, PokeApiFalsa } from './fixtures/pokeapi';

const nomesDosCards = (page: Page) => page.locator('app-pokemon-card .card-title');
const busca = (page: Page) => page.getByPlaceholder('Search');

let api: PokeApiFalsa;
test.beforeEach(async ({ page }) => {
  api = await simularPokeApi(page);
});

test('mostra as regiões como botões, com o nome legível', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Pokedex' })).toBeVisible();
  await expect(page.getByRole('button')).toHaveText(['National', 'Kanto', 'Original Johto']);
});

test('abre em Kanto, na ordem da Pokédex, mesmo que a rede responda fora de ordem', async ({ page }) => {
  await page.goto('/');
  await expect(nomesDosCards(page)).toHaveText(['Bulbasaur', 'Ivysaur', 'Charmander']);
});

test('cada card mostra os tipos e a imagem oficial com o número em 3 dígitos', async ({ page }) => {
  await page.goto('/');
  const bulbasaur = page.locator('app-pokemon-card').filter({ hasText: 'Bulbasaur' });
  await expect(bulbasaur.locator('.badge')).toHaveText(['Grass', 'Poison']);
  await expect(bulbasaur.locator('.badge').first()).toHaveClass(/bg-grass/);
  await expect(bulbasaur.locator('img')).toHaveAttribute('src', 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png');
});

test('a busca filtra pelo nome, sem diferenciar maiúsculas', async ({ page }) => {
  await page.goto('/');
  await expect(nomesDosCards(page)).toHaveCount(3);
  await busca(page).fill('SAUR');
  await expect(nomesDosCards(page)).toHaveText(['Bulbasaur', 'Ivysaur']);
  await busca(page).fill('char');
  await expect(nomesDosCards(page)).toHaveText(['Charmander']);
  await busca(page).fill('');
  await expect(nomesDosCards(page)).toHaveCount(3);
});

test('trocar de região troca a lista', async ({ page }) => {
  await page.goto('/');
  await expect(nomesDosCards(page)).toHaveCount(3);
  await page.getByRole('button', { name: 'Original Johto' }).click();
  await expect(nomesDosCards(page)).toHaveText(['Chikorita', 'Cyndaquil']);
});

test('voltar a uma região já vista não pede os Pokémon de novo à API', async ({ page }) => {
  await page.goto('/');
  await expect(nomesDosCards(page)).toHaveCount(3);
  await page.getByRole('button', { name: 'Original Johto' }).click();
  await expect(nomesDosCards(page)).toHaveText(['Chikorita', 'Cyndaquil']);
  await page.getByRole('button', { name: 'Kanto' }).click();
  await expect(nomesDosCards(page)).toHaveText(['Bulbasaur', 'Ivysaur', 'Charmander']);
  expect(api.pedidosDeDetalhe.sort()).toEqual(['bulbasaur', 'charmander', 'chikorita', 'cyndaquil', 'ivysaur']);
});
