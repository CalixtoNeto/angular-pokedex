// O site em inglês (raiz), português (/pt/) e espanhol (/es/), visto de fora.
// Textos do próprio app são traduzidos; os que vêm da PokeAPI aparecem no idioma quando a API os tem.
import { test, expect, Page } from '@playwright/test';
import { simularPokeApi } from './fixtures/pokeapi';

const titulo = (page: Page) => page.getByRole('heading', { level: 1 });
const aba = (page: Page, nome: string) => page.getByRole('tab', { name: nome });
const idiomas = (page: Page) => page.getByRole('navigation', { name: /Language|Idioma/ });

test.beforeEach(async ({ page }) => {
  await simularPokeApi(page);
});

test('em inglês na raiz, o documento declara o idioma', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(idiomas(page).getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'page');
});

test('em português, a lista traduz título, busca e tipos', async ({ page }) => {
  await page.goto('/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'Pokédex' })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar')).toBeVisible();
  const bulbasaur = page.locator('app-pokemon-card').filter({ hasText: 'Bulbasaur' });
  await expect(bulbasaur.locator('.badge')).toHaveText(['Planta', 'Venenoso']);
});

test('em português, o detalhe traduz abas, rótulos e números; sem texto da API em pt, mostra o inglês marcado', async ({ page }) => {
  await page.goto('/pt/pokemon/bulbasaur');
  await expect(titulo(page)).toHaveText('Bulbasaur');
  await expect(page.locator('.detail-header .badge')).toHaveText(['Planta', 'Venenoso']);
  const sobre = page.getByRole('tabpanel');
  await expect(sobre).toContainText('Espécie');
  await expect(sobre).toContainText('0,7 m');
  await expect(sobre).toContainText('6,9 kg');
  await expect(sobre).toContainText('Overgrow, Chlorophyll (oculta)');
  await expect(sobre).toContainText('♂ 87,5%');
  await expect(sobre.locator('[lang="en"]').first()).toContainText('A strange seed was planted on its back at birth.');
  await aba(page, 'Atributos base').click();
  await expect(page.getByRole('tabpanel').getByRole('row')).toHaveText([
    /PS\s*45/, /Ataque\s*49/, /Defesa\s*49/, /At\. Esp\.\s*65/, /Def\. Esp\.\s*65/, /Velocidade\s*45/, /Total\s*318/,
  ]);
  await aba(page, 'Evolução').click();
  await expect(page.getByRole('tabpanel').getByRole('link')).toHaveText([/Bulbasaur/, /Ivysaur\s*Nv\. 16/, /Venusaur\s*Nv\. 32/]);
  await aba(page, 'Defesas').click();
  await expect(page.locator('[data-defense="weak"] li')).toHaveText(['Fogo ×2', 'Gelo ×2', 'Voador ×2', 'Psíquico ×2']);
});

test('em espanhol, espécie e descrição vêm da PokeAPI em espanhol', async ({ page }) => {
  await page.goto('/es/pokemon/bulbasaur');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('.detail-header .badge')).toHaveText(['Planta', 'Veneno']);
  const sobre = page.getByRole('tabpanel');
  await expect(sobre).toContainText('Pokémon Semilla');
  await expect(sobre).toContainText('Una rara semilla le fue plantada en el lomo al nacer.');
  await expect(sobre).toContainText('Overgrow, Chlorophyll (oculta)');
  // Habilidades e grupos de ovo a PokeAPI só tem em inglês: o leitor de tela precisa saber.
  await expect(sobre.locator('[lang="en"]')).toHaveText(['Overgrow', 'Chlorophyll', 'Monster, Plant']);
  await aba(page, 'Evolución').click();
  await expect(page.getByRole('tabpanel').getByRole('link')).toHaveText([/Bulbasaur/, /Ivysaur\s*Nv\. 16/, /Venusaur\s*Nv\. 32/]);
});

test('o seletor de idioma leva à mesma página no outro idioma', async ({ page }) => {
  await page.goto('/pokemon/bulbasaur');
  await idiomas(page).getByRole('link', { name: 'Português' }).click();
  await expect(page).toHaveURL(/\/pt\/pokemon\/bulbasaur$/);
  await expect(aba(page, 'Sobre')).toBeVisible();
  await idiomas(page).getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/pokemon\/bulbasaur$/);
  await expect(aba(page, 'Información')).toBeVisible();
  await idiomas(page).getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/localhost:4300\/pokemon\/bulbasaur$/);
  await expect(aba(page, 'About')).toBeVisible();
});

test('cada idioma do seletor se anuncia no próprio idioma', async ({ page }) => {
  await page.goto('/pt/');
  const links = idiomas(page).getByRole('link');
  await expect(links).toHaveText(['English', 'Português', 'Español']);
  await expect(links.nth(1)).toHaveAttribute('lang', 'pt-BR');
  await expect(links.nth(1)).toHaveAttribute('aria-current', 'page');
  await expect(links.nth(2)).toHaveAttribute('hreflang', 'es');
});
