import { Routes } from '@angular/router';

// A página de detalhe só é baixada quando alguém abre um Pokémon.
export const pokemonDetailRoutes: Routes = [
  {
    path: ':name',
    loadComponent: () => import('./pokemon-detail-page/pokemon-detail-page.component').then(m => m.PokemonDetailPageComponent),
  },
];
