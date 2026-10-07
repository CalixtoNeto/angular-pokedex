import { Component, computed, inject, input, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { PokemonRepository, typeDefenses } from '@pokedex/domain';
import { pokedexNumber } from '@pokedex/ui';
import {
  EvolutionChainComponent, PokemonAboutComponent, RarityBadgeComponent, StatBarsComponent, TypeDefensesComponent,
} from '@pokedex/ui-detail';

type Tab = 'about' | 'stats' | 'evolution' | 'defenses';

const TABS: { id: Tab; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'stats', label: 'Base Stats' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'defenses', label: 'Defenses' },
];

// Componente smart: lê a rota (name), pede o detalhe ao repositório e distribui os dados aos componentes de ui.
@Component({
  selector: 'app-pokemon-detail-page',
  imports: [
    RouterLink, TitleCasePipe, PokemonAboutComponent, StatBarsComponent, EvolutionChainComponent, TypeDefensesComponent,
    RarityBadgeComponent,
  ],
  templateUrl: './pokemon-detail-page.component.html',
  styleUrl: './pokemon-detail-page.component.css',
})
export class PokemonDetailPageComponent {
  private readonly repository = inject(PokemonRepository);

  readonly name = input.required<string>();

  protected readonly tabs = TABS;
  protected readonly selectedTab = signal<Tab>('about');

  protected readonly request = rxResource({
    params: () => this.name(),
    stream: ({ params }) => this.repository.detail(params),
  });

  protected readonly detail = computed(() => (this.request.hasValue() ? this.request.value() : null));
  protected readonly number = computed(() => pokedexNumber(this.detail()?.id ?? 0));
  protected readonly defenses = computed(() => typeDefenses(this.detail()?.types ?? []));
}
