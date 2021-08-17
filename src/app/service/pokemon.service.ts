import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private URL: string = environment.URL_API_POKEMON;
  private URL_POKEDEX: string = environment.URL_API_POKEDEX;
  private _pokemons: any[] = [];
  private _pokedex: any[] = [];
  private subscriptions: Subscription[] = [];
  private _next: string = '';


  constructor(private httpService: HttpClient) { }

  get pokemons(): any[] {
    return this._pokemons;
  }
  get pokedex(): any[] {
    return this._pokedex;
  }

  get next(): string {
    return this._next;
  }

  set next(next: string) {
    this._next = next;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  getType(pokemon: any): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }

  get(name: string): Observable<any> {
    const url = `${this.URL}${name}`;
    return this.httpService.get<any>(url);
  }
  getRegion() {
    this.httpService.get<any>(this.URL_POKEDEX).subscribe(region => {
      this._pokedex = region.results;
    });
  }

  getNext(pokedex: string): Observable<any> {
    // const url = this.next === '' ? `${pokedex}?limit=500` : this.next;
    const url = `${pokedex}?limit=500`
    return this.httpService.get<any>(url);
  }

  unsubscribeALL() {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  async fetchPokemons(pokedex: string) {
    await this.unsubscribeALL()
    this._pokemons = []
    this.subscription = this.getNext(pokedex).subscribe(pokemons => {
      // this.next = pokemons.next ? pokemons.next : '';
      const details = pokemons.pokemon_entries.map((pokemon: any) => this.get(pokemon.pokemon_species.name));
      this.subscription = concat(...details).subscribe((response: any) => {

        this._pokemons.push(
          {
            image: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${response.id.toString()
              .padStart(3, '0')}.png`,
            number: response.id,
            name: response.name,
            types: response.types.map((types: any) => types.type.name),
            ...response
          });
      });
    })
  }
}

