import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PokemonListComponent],
})
export class AppComponent {
  title = 'angular-pokedex';
}
