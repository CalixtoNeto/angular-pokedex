import { Component, computed, input } from '@angular/core';
import { PokemonDetail } from '@pokedex/domain';
import { titleCaseSlug } from '@pokedex/ui';

@Component({
  selector: 'app-pokemon-about',
  templateUrl: './pokemon-about.component.html',
  styleUrl: './pokemon-about.component.css',
})
export class PokemonAboutComponent {
  readonly detail = input.required<PokemonDetail>();

  protected readonly abilities = computed(() =>
    this.detail().abilities.map(({ name, hidden }) => `${titleCaseSlug(name)}${hidden ? ' (hidden)' : ''}`).join(', '),
  );
  protected readonly eggGroups = computed(() => this.detail().eggGroups.map(titleCaseSlug).join(', '));
}
