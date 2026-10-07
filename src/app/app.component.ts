import { Component } from '@angular/core';
import { PokemonListComponent } from '@pokedex/feature-list';

@Component({
  selector: 'app-root',
  template: '<app-pokemon-list />',
  imports: [PokemonListComponent],
})
export class AppComponent {}
