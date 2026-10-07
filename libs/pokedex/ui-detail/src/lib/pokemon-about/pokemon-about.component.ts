import { Component, computed, input } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { PokemonDetail } from '@pokedex/domain';
import { titleCaseSlug } from '@pokedex/ui';

const HIDDEN = $localize`:Marks a hidden ability@@about.hiddenAbility:(hidden)`;

// Números saem no formato do idioma do site (0.7 m, 0,7 m) pelos pipes, que seguem o LOCALE_ID.
@Component({
  selector: 'app-pokemon-about',
  imports: [DecimalPipe, PercentPipe],
  templateUrl: './pokemon-about.component.html',
  styleUrl: './pokemon-about.component.css',
})
export class PokemonAboutComponent {
  readonly detail = input.required<PokemonDetail>();

  protected readonly abilities = computed(() =>
    this.detail().abilities.map(({ name, hidden }) => ({ name, label: titleCaseSlug(name), suffix: hidden ? ` ${HIDDEN}` : '' })),
  );
  protected readonly eggGroups = computed(() => this.detail().eggGroups.map(titleCaseSlug).join(', '));
}
