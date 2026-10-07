import { Component, input } from '@angular/core';
import { Rarity } from '@pokedex/domain';

const LABELS: Record<Rarity, string> = { legendary: 'Legendary', mythical: 'Mythical', baby: 'Baby' };

@Component({
  selector: 'app-rarity-badge',
  template: `
    @if (rarity(); as rarity) {
      <span class="rarity rarity-{{ rarity }}">{{ labels[rarity] }}</span>
    }
  `,
  styleUrl: './rarity-badge.component.css',
})
export class RarityBadgeComponent {
  readonly rarity = input.required<Rarity | null>();
  protected readonly labels = LABELS;
}
