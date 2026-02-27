import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { map, mergeMap, takeUntil, toArray } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon';

interface PokedexEntryResponse {
  pokemon_entries: Array<{ pokemon_species: { name: string } }>;
  results?: Array<{ name: string; url: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly URL = environment.URL_API_POKEMON;
  private readonly URL_POKEDEX = environment.URL_API_POKEDEX;
  private _pokemons: Pokemon[] = [];
  private _pokedex: Array<{ name: string; url: string }> = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private httpService: HttpClient) {}

  get pokemons(): Pokemon[] {
    return this._pokemons;
  }

  get pokedex(): Array<{ name: string; url: string }> {
    return this._pokedex;
  }

  getType(pokemon: { types: Array<{ type: { name: string } }> }): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }

  get(name: string): Observable<any> {
    return this.httpService.get<any>(`${this.URL}${name}`);
  }

  getRegion(): void {
    this.httpService
      .get<PokedexEntryResponse>(this.URL_POKEDEX)
      .pipe(takeUntil(this.destroy$))
      .subscribe((region) => {
        this._pokedex = region.results ?? [];
      });
  }

  getNext(pokedex: string): Observable<PokedexEntryResponse> {
    return this.httpService.get<PokedexEntryResponse>(`${pokedex}?limit=500`);
  }

  unsubscribeALL(): void {
    this.destroy$.next();
  }

  fetchPokemons(pokedex: string): void {
    this.unsubscribeALL();
    this._pokemons = [];

    this.getNext(pokedex)
      .pipe(
        map((response) => response.pokemon_entries ?? []),
        mergeMap((entries) => from(entries)),
        mergeMap((entry) => this.get(entry.pokemon_species.name), 20),
        map((response: any) => ({
          image: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${response.id
            .toString()
            .padStart(3, '0')}.png`,
          number: response.id,
          name: response.name,
          types: response.types,
        } as Pokemon)),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe((pokemons) => {
        this._pokemons = pokemons.sort((a, b) => a.number - b.number);
      });
  }
}
