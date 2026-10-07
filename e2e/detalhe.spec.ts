// O detalhe do Pokémon, visto de fora. Os números vêm das respostas reais da PokeAPI usadas como fixture.
import { test, expect, Page } from '@playwright/test';
import { simularPokeApi } from './fixtures/pokeapi';

const titulo = (page: Page) => page.getByRole('heading', { level: 1 });
const aba = (page: Page, nome: string) => page.getByRole('tab', { name: nome });

test.beforeEach(async ({ page }) => {
  await simularPokeApi(page);
});

test('clicar num card abre o detalhe com número, tipos e a arte oficial', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Bulbasaur/ }).click();
  await expect(page).toHaveURL(/\/pokemon\/bulbasaur$/);
  await expect(titulo(page)).toHaveText('Bulbasaur');
  await expect(page.getByText('#001')).toBeVisible();
  await expect(page.locator('.detail-header .badge')).toHaveText(['Grass', 'Poison']);
  await expect(page.getByRole('img', { name: 'bulbasaur' })).toHaveAttribute('src', /official-artwork\/1\.png$/);
});

test('About mostra espécie, descrição, medidas, habilidades e gênero', async ({ page }) => {
  await page.goto('/pokemon/bulbasaur');
  const sobre = page.getByRole('tabpanel');
  await expect(sobre).toContainText('Seed Pokémon');
  await expect(sobre).toContainText('A strange seed was planted on its back at birth.');
  await expect(sobre).toContainText('0.7 m');
  await expect(sobre).toContainText('6.9 kg');
  await expect(sobre).toContainText('Overgrow, Chlorophyll (hidden)');
  await expect(sobre).toContainText('♂ 87.5%');
  await expect(sobre).toContainText('♀ 12.5%');
  await expect(sobre).toContainText('Monster, Plant');
});

test('Base Stats mostra cada stat e o total', async ({ page }) => {
  await page.goto('/pokemon/bulbasaur');
  await aba(page, 'Base Stats').click();
  const linhas = page.getByRole('tabpanel').getByRole('row');
  await expect(linhas).toHaveText([/HP\s*45/, /Attack\s*49/, /Defense\s*49/, /Sp\. Atk\s*65/, /Sp\. Def\s*65/, /Speed\s*45/, /Total\s*318/]);
});

test('Evolution mostra a cadeia com a condição e leva ao detalhe da evolução', async ({ page }) => {
  await page.goto('/pokemon/bulbasaur');
  await aba(page, 'Evolution').click();
  const etapas = page.getByRole('tabpanel').getByRole('link');
  await expect(etapas).toHaveText([/Bulbasaur/, /Ivysaur\s*Lv\. 16/, /Venusaur\s*Lv\. 32/]);
  await etapas.nth(1).click();
  await expect(page).toHaveURL(/\/pokemon\/ivysaur$/);
  await expect(titulo(page)).toHaveText('Ivysaur');
});

test('evolução ramificada e por item aparecem com a condição certa', async ({ page }) => {
  await page.goto('/pokemon/pikachu');
  await aba(page, 'Evolution').click();
  await expect(page.getByRole('tabpanel').getByRole('link')).toHaveText([/Pichu/, /Pikachu\s*Friendship/, /Raichu\s*Thunder Stone/]);
});

test('Defenses mostra fraquezas e resistências calculadas pelos tipos', async ({ page }) => {
  await page.goto('/pokemon/bulbasaur');
  await aba(page, 'Defenses').click();
  await expect(page.locator('[data-defense="weak"] li')).toHaveText(['Fire ×2', 'Ice ×2', 'Flying ×2', 'Psychic ×2']);
  await expect(page.locator('[data-defense="resistant"] li'))
    .toHaveText(['Water ×½', 'Electric ×½', 'Grass ×¼', 'Fighting ×½', 'Fairy ×½']);
  await expect(page.locator('[data-defense="immune"] li')).toHaveCount(0);
});

test('lendários e míticos ganham selo de raridade; os demais não', async ({ page }) => {
  await page.goto('/pokemon/mewtwo');
  await expect(page.locator('.rarity')).toHaveText('Legendary');
  await page.goto('/pokemon/mew');
  await expect(page.locator('.rarity')).toHaveText('Mythical');
  await page.goto('/pokemon/pichu');
  await expect(page.locator('.rarity')).toHaveText('Baby');
  await page.goto('/pokemon/bulbasaur');
  await expect(titulo(page)).toHaveText('Bulbasaur');
  await expect(page.locator('.rarity')).toHaveCount(0);
});

test('o endereço do detalhe abre direto e o botão de voltar leva à lista', async ({ page }) => {
  await page.goto('/pokemon/charmander');
  await expect(titulo(page)).toHaveText('Charmander');
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'Pokedex' })).toBeVisible();
});
