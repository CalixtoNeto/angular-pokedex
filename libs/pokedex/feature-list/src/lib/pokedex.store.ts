import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PokemonRepository, filterByName } from '@pokedex/domain';

const DEFAULT_REGION = 'kanto';

@Injectable({ providedIn: 'root' })
export class PokedexStore {
  private readonly repository = inject(PokemonRepository);

  readonly regions = toSignal(this.repository.regions(), { initialValue: [] });
  readonly selectedRegion = signal(DEFAULT_REGION);
  readonly search = signal('');

  // Trocar de região cancela os pedidos da anterior: o rxResource cancela o stream antigo sozinho.
  private readonly pokemonsOfRegion = rxResource({
    params: () => this.selectedRegion(),
    stream: ({ params }) => this.repository.pokemonsOfRegion(params),
  });

  readonly pokemons = computed(() => (this.pokemonsOfRegion.hasValue() ? this.pokemonsOfRegion.value() : []));
  readonly visiblePokemons = computed(() => filterByName(this.pokemons(), this.search()));

  selectRegion(regionId: string) {
    this.selectedRegion.set(regionId);
  }
}
