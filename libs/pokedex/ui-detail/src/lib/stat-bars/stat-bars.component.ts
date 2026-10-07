import { Component, computed, input } from '@angular/core';
import { BaseStat, StatName, statTotal } from '@pokedex/domain';

const LABELS: Record<StatName, string> = {
  hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed',
};

// Poucos stats base passam de 180; acima disso a barra fica cheia.
const BAR_SCALE = 180;
const LOW_STAT = 60;

@Component({
  selector: 'app-stat-bars',
  template: `
    <table class="stat-bars">
      @for (stat of rows(); track stat.label) {
        <tr>
          <th scope="row">{{ stat.label }}</th>
          <td class="value">{{ stat.value }}</td>
          <td class="stat-bar"><span [style.width.%]="stat.width" [class.low]="stat.low"></span></td>
        </tr>
      }
      <tr class="total">
        <th scope="row">Total</th>
        <td class="value">{{ total() }}</td>
        <td></td>
      </tr>
    </table>
  `,
  styleUrl: './stat-bars.component.css',
})
export class StatBarsComponent {
  readonly stats = input.required<BaseStat[]>();

  protected readonly total = computed(() => statTotal(this.stats()));
  protected readonly rows = computed(() =>
    this.stats().map(({ name, value }) => ({
      label: LABELS[name],
      value,
      width: Math.min(100, (value / BAR_SCALE) * 100),
      low: value < LOW_STAT,
    })),
  );
}
