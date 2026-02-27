import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon';
import { PokemonService } from './../service/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent implements OnInit, OnDestroy {
  public searchFilter = '';

  constructor(private pokemonService: PokemonService) {}

  get pokemons(): Pokemon[] {
    return this.pokemonService.pokemons;
  }

  get pokedex(): Array<{ name: string; url: string }> {
    return this.pokemonService.pokedex;
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.pokemonPagination(environment.URL_API_DEFAUT);
    }

    if (!this.pokedex.length) {
      this.getRegion();
    }
  }

  ngOnDestroy(): void {
    this.pokemonService.unsubscribeALL();
  }

  pokemonPagination(url: string): void {
    this.pokemonService.fetchPokemons(url);
  }

  getRegion(): void {
    this.pokemonService.getRegion();
  }

  trackByPokemonNumber(_: number, pokemon: Pokemon): number {
    return pokemon.number;
  }

  trackByRegion(_: number, region: { name: string; url: string }): string {
    return region.name;
  }
}
