import { Component } from '@angular/core';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  template: '<app-pokemon-list />',
  imports: [PokemonListComponent],
})
export class AppComponent {}
