import { Observable } from 'rxjs';
import { Pokemon, Region } from './pokemon';
import { PokemonDetail } from './pokemon-detail';

// O contrato que a interface conhece. A implementação que fala com a PokeAPI fica em @pokedex/data-access
// e é escolhida na composição do app; nenhuma feature sabe de onde os dados vêm.
export abstract class PokemonRepository {
  abstract regions(): Observable<Region[]>;

  // Emite a lista a cada Pokémon carregado, sempre na ordem da Pokédex da região.
  abstract pokemonsOfRegion(regionId: string): Observable<Pokemon[]>;

  abstract detail(name: string): Observable<PokemonDetail>;
}
