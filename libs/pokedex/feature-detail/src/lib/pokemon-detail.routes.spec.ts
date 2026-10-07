import { pokemonDetailRoutes } from './pokemon-detail.routes';
import { PokemonDetailPageComponent } from './pokemon-detail-page/pokemon-detail-page.component';

describe('pokemonDetailRoutes', () => {
  it('a rota :name carrega a página do detalhe', async () => {
    const [route] = pokemonDetailRoutes;
    expect(route?.path).toBe(':name');
    expect(await route?.loadComponent?.()).toBe(PokemonDetailPageComponent);
  });
});
