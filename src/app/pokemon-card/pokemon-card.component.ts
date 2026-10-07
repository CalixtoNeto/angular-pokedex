import { Component, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Pokemon } from '../pokedex/pokemon';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css',
  imports: [TitleCasePipe],
})
export class PokemonCardComponent {
  readonly pokemon = input.required<Pokemon>();
}
