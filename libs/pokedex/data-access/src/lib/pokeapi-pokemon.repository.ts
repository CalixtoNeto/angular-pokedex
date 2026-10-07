import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, catchError, from, map, mergeMap, of, scan, switchMap } from 'rxjs';
import { Pokemon, PokemonDetail, PokemonRepository, Region } from '@pokedex/domain';
import {
  EvolutionChainResponse, PokedexResponse, PokemonDetailResponse, PokemonResponse, RegionListResponse, SpeciesResponse,
} from './pokeapi.types';
import { toPokemon, toRegion } from './pokeapi.mappers';
import { toPokemonDetail } from './pokeapi-detail.mappers';
import { idFromUrl } from './pokeapi-evolution.mappers';

export const POKEAPI_URL = 'https://pokeapi.co/api/v2';
const REGIONS_URL = `${POKEAPI_URL}/pokedex/?offset=0&limit=100`;

// Limite educado de pedidos simultâneos à PokeAPI.
const PARALLEL_REQUESTS = 6;

@Injectable()
export class PokeApiPokemonRepository extends PokemonRepository {
  private readonly http = inject(HttpClient);
  // Cada idioma é um build separado; o Angular define o LOCALE_ID de cada um.
  private readonly localeId = inject(LOCALE_ID);

  regions(): Observable<Region[]> {
    return this.http.get<RegionListResponse>(REGIONS_URL).pipe(map(list => list.results.map(toRegion)));
  }

  pokemonsOfRegion(regionId: string): Observable<Pokemon[]> {
    return this.http.get<PokedexResponse>(`${POKEAPI_URL}/pokedex/${regionId}/`).pipe(
      map(pokedex => pokedex.pokemon_entries.map(entry => entry.pokemon_species.name)),
      switchMap(names => (names.length ? this.pokemonsInOrder(names) : of([]))),
    );
  }

  // Três pedidos em sequência: a espécie diz qual é a cadeia de evolução.
  detail(name: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetailResponse>(`${POKEAPI_URL}/pokemon/${name}`).pipe(
      switchMap(pokemon => this.http.get<SpeciesResponse>(`${POKEAPI_URL}/pokemon-species/${pokemon.species.name}`).pipe(
        switchMap(species => this.evolutionChainOf(species).pipe(map(chain => toPokemonDetail(pokemon, species, chain, this.localeId)))),
      )),
    );
  }

  private evolutionChainOf(species: SpeciesResponse): Observable<EvolutionChainResponse> {
    return this.http.get<EvolutionChainResponse>(`${POKEAPI_URL}/evolution-chain/${idFromUrl(species.evolution_chain.url)}/`);
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
