import { Subscription } from 'rxjs';
import { PokemonService } from './../service/pokemon.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  loading: boolean = false;

  constructor(private pokemonService: PokemonService) { }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }
  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.pokemonPagination()
    }
  }

  ngOnDestroy(): void {
    this.pokemonService.unsubscribeALL()
  }

  pokemonPagination(): void {
    this.pokemonService.fetchPokemons()
  }
}
