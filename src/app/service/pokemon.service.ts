import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private URL: string = environment.URL_API + 'pokemon/';
  private _pokemons: any[] = [];
  private subscriptions: Subscription[] = [];
  private _next: string = '';


  constructor(private httpService: HttpClient) { }

  get pokemons(): any[] {
    return this._pokemons;
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

  getNext(): Observable<any> {
    const url = this.next === '' ? `${this.URL}?limit=100` : this.next;
    return this.httpService.get<any>(url);
  }

  unsubscribeALL() {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  fetchPokemons() {
    this.subscription = this.getNext().subscribe(pokemons => {
      this.next = pokemons.next;
      const details = pokemons.results.map((pokemon: Pokemon) => this.get(pokemon.name));
      this.subscription = concat(...details).subscribe((response: any) => {

        this._pokemons.push(
          {
            image: response.sprites.front_default,
            number: response.id,
            name: response.name,
            types: response.types.map((types: any) => types.type.name),
            ...response
          });
      });
    })
  }
}

