import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonCardComponent } from '@pokedex/ui';
import { PokedexStore } from '../pokedex.store';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  imports: [PokemonCardComponent, TitleCasePipe, RouterLink],
  styles: '.pokemon-link { display: block; text-decoration: none; }',
})
export class PokemonListComponent {
  protected readonly store = inject(PokedexStore);

  protected onSearch(event: Event) {
    this.store.search.set((event.target as HTMLInputElement).value);
  }
}
