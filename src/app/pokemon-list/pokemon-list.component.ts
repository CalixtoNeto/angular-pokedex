import { Subscription } from 'rxjs';
import { PokemonService } from './../service/pokemon.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  loading: boolean = false;
  public searchFilter: any = '';


  constructor(private pokemonService: PokemonService) { }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  get pokedex(): any[] {
    return this.pokemonService.pokedex;
  }
  get next(): string {
    return this.pokemonService.next;
  }
  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.pokemonPagination(environment.URL_API_DEFAUT)
    }
    if (!this.pokedex.length) {
      this.getRegion()
    }
  }

  ngOnDestroy(): void {
    this.pokemonService.unsubscribeALL()
  }

  pokemonPagination(url: string): void {
    this.pokemonService.fetchPokemons(url)
  }
  getRegion(): void {
    this.pokemonService.getRegion()
  }
}


