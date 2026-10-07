import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PokemonCardComponent } from '@pokedex/ui';
import { PokedexStore } from '../pokedex.store';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  imports: [PokemonCardComponent, TitleCasePipe],
})
export class PokemonListComponent {
  protected readonly store = inject(PokedexStore);

  protected onSearch(event: Event) {
    this.store.search.set((event.target as HTMLInputElement).value);
  }
}
