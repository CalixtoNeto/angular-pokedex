import { Component, computed, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Pokemon } from '@pokedex/domain';
import { pokedexNumber } from '../format/format';
import { TypeLabelPipe } from '../type-label/type-label';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css',
  imports: [TitleCasePipe, TypeLabelPipe],
})
export class PokemonCardComponent {
  readonly pokemon = input.required<Pokemon>();
  protected readonly number = computed(() => pokedexNumber(this.pokemon().id));
  protected readonly mainType = computed(() => this.pokemon().types[0] ?? 'normal');
}
