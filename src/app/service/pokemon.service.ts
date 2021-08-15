import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private url: string = environment.URL_API + 'pokemon/';
  private _pokemons: any[] = [];
  private _next: string = '';


  constructor(private httpService: HttpClient) { }
}
