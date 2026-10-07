import { Component, computed, input } from '@angular/core';
import { TypeDefenses } from '@pokedex/domain';
import { formatMultiplier, titleCaseSlug } from '@pokedex/ui';

@Component({
  selector: 'app-type-defenses',
  template: `
    @for (group of groups(); track group.key) {
      <section class="mb-3" [attr.data-defense]="group.key">
        <h4 class="h6">{{ group.title }}</h4>
        @if (group.items.length) {
          <ul class="list-unstyled d-flex flex-wrap gap-1">
            @for (item of group.items; track item.type) {
              <li class="badge rounded-pill bg-{{ item.type }}">{{ item.label }}</li>
            }
          </ul>
        } @else {
          <p class="text-muted small">None</p>
        }
      </section>
    }
  `,
})
export class TypeDefensesComponent {
  readonly defenses = input.required<TypeDefenses>();

  protected readonly groups = computed(() => {
    const { weak, resistant, immune } = this.defenses();
    const label = (list: typeof weak) => list.map(({ type, multiplier }) => ({ type, label: `${titleCaseSlug(type)} ${formatMultiplier(multiplier)}` }));
    return [
      { key: 'weak', title: 'Weak to', items: label(weak) },
      { key: 'resistant', title: 'Resistant to', items: label(resistant) },
      { key: 'immune', title: 'Immune to', items: label(immune) },
    ];
  });
}
