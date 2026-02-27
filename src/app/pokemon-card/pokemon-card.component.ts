import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pokemon } from './../models/pokemon';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  @Input() public pokemon!: Pokemon;
}
