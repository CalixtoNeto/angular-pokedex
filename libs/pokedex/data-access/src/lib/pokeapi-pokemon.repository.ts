import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, catchError, from, map, mergeMap, of, scan, switchMap } from 'rxjs';
import { Pokemon, PokemonRepository, Region } from '@pokedex/domain';
import { PokedexResponse, PokemonResponse, RegionListResponse } from './pokeapi.types';
import { toPokemon, toRegion } from './pokeapi.mappers';

export const POKEAPI_URL = 'https://pokeapi.co/api/v2';
const REGIONS_URL = `${POKEAPI_URL}/pokedex/?offset=0&limit=100`;

// Limite educado de pedidos simultâneos à PokeAPI.
const PARALLEL_REQUESTS = 6;

@Injectable()
export class PokeApiPokemonRepository extends PokemonRepository {
  private readonly http = inject(HttpClient);

  regions(): Observable<Region[]> {
    return this.http.get<RegionListResponse>(REGIONS_URL).pipe(map(list => list.results.map(toRegion)));
  }

  pokemonsOfRegion(regionId: string): Observable<Pokemon[]> {
    return this.http.get<PokedexResponse>(`${POKEAPI_URL}/pokedex/${regionId}/`).pipe(
      map(pokedex => pokedex.pokemon_entries.map(entry => entry.pokemon_species.name)),
      switchMap(names => (names.length ? this.pokemonsInOrder(names) : of([]))),
    );
  }

  private pokemonsInOrder(names: string[]): Observable<Pokemon[]> {
    return from(names.entries()).pipe(
      mergeMap(([position, name]) => this.pokemon(name).pipe(map(pokemon => ({ position, pokemon }))), PARALLEL_REQUESTS),
      scan((slots, { position, pokemon }) => placeAt(slots, position, pokemon), new Array<Pokemon | undefined>(names.length)),
      map(slots => slots.filter(pokemon => pokemon !== undefined)),
    );
  }

  // Algumas espécies não têm um Pokémon com o mesmo nome (deoxys é deoxys-normal); essas ficam de fora.
  private pokemon(name: string): Observable<Pokemon> {
    return this.http.get<PokemonResponse>(`${POKEAPI_URL}/pokemon/${name}`).pipe(
      map(toPokemon),
      catchError(() => EMPTY),
    );
  }
}

function placeAt<T>(slots: T[], position: number, item: T): T[] {
  const next = [...slots];
  next[position] = item;
  return next;
}
