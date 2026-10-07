import { Routes } from '@angular/router';
import { PokemonListComponent } from '@pokedex/feature-list';

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon', loadChildren: () => import('@pokedex/feature-detail').then(m => m.pokemonDetailRoutes) },
  { path: '**', redirectTo: '' },
];
