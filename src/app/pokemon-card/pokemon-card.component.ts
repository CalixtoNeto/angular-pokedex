import { Pokemon } from './../models/pokemon';
import { PokemonService } from './../service/pokemon.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent implements OnInit {

  @Input() public pokemon: any;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

}
