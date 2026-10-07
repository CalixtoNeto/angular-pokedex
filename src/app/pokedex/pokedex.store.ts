import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_REGION_URL, PokeApiClient } from '../pokeapi/pokeapi.client';
import { filterByName } from './filter-by-name';

@Injectable({ providedIn: 'root' })
export class PokedexStore {
  private readonly api = inject(PokeApiClient);

  readonly regions = toSignal(this.api.regions(), { initialValue: [] });
  readonly selectedRegion = signal(DEFAULT_REGION_URL);
  readonly search = signal('');

  // Trocar de região cancela os pedidos da anterior: o rxResource cancela o stream antigo sozinho.
  private readonly pokemonsOfRegion = rxResource({
    params: () => this.selectedRegion(),
    stream: ({ params }) => this.api.pokemonsOfRegion(params),
  });

  readonly pokemons = computed(() => (this.pokemonsOfRegion.hasValue() ? this.pokemonsOfRegion.value() : []));
  readonly visiblePokemons = computed(() => filterByName(this.pokemons(), this.search()));

  selectRegion(url: string) {
    this.selectedRegion.set(url);
  }
}
