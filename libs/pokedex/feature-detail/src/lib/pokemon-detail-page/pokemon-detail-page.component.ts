import { Component, computed, inject, input, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { PokemonRepository, typeDefenses } from '@pokedex/domain';
import { TypeLabelPipe, pokedexNumber } from '@pokedex/ui';
import {
  EvolutionChainComponent, PokemonAboutComponent, RarityBadgeComponent, StatBarsComponent, TypeDefensesComponent,
} from '@pokedex/ui-detail';

type Tab = 'about' | 'stats' | 'evolution' | 'defenses';

const TABS: { id: Tab; label: string }[] = [
  { id: 'about', label: $localize`:Detail tab@@detail.tab.about:About` },
  { id: 'stats', label: $localize`:Detail tab@@detail.tab.stats:Base Stats` },
  { id: 'evolution', label: $localize`:Detail tab@@detail.tab.evolution:Evolution` },
  { id: 'defenses', label: $localize`:Detail tab@@detail.tab.defenses:Defenses` },
];

// Componente smart: lê a rota (name), pede o detalhe ao repositório e distribui os dados aos componentes de ui.
@Component({
  selector: 'app-pokemon-detail-page',
  imports: [
    RouterLink, TitleCasePipe, PokemonAboutComponent, StatBarsComponent, EvolutionChainComponent, TypeDefensesComponent,
    RarityBadgeComponent, TypeLabelPipe,
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

  // Número e defesas só existem com o detalhe carregado: saem juntos dele, sem valor provisório.
  protected readonly page = computed(() => {
    if (!this.request.hasValue()) return null;
    const pokemon = this.request.value();
    return { pokemon, number: pokedexNumber(pokemon.id), defenses: typeDefenses(pokemon.types) };
  });
}
