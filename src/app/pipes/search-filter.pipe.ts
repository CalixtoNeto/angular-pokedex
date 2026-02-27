import { Pipe, PipeTransform } from '@angular/core';
import { Pokemon } from '../models/pokemon';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: Pokemon[] | null, args?: string): Pokemon[] {
    if (!value) {
      return [];
    }

    if (!args) {
      return value;
    }

    const normalizedTerm = args.toLowerCase().trim();
    return value.filter((pokemon) => pokemon.name.toLowerCase().includes(normalizedTerm));
  }
}
