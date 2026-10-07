import { Component, computed, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EvolutionStage } from '@pokedex/domain';
import { evolutionConditionLabel } from './evolution-condition-label';

@Component({
  selector: 'app-evolution-chain',
  imports: [RouterLink, TitleCasePipe],
  template: `
    @if (steps().length > 1) {
      <div class="evolution-chain">
        @for (step of steps(); track $index) {
          <div class="evolution-step">
            @for (stage of step; track stage.id) {
              <a class="evolution-stage" [routerLink]="['/pokemon', stage.name]">
                <img [src]="stage.image" [alt]="stage.name" loading="lazy" />
                <span class="name">{{ stage.name | titlecase }}</span>
                @if (stage.condition; as condition) {
                  <small class="condition" [attr.lang]="condition.lang">{{ condition.text }}</small>
                }
              </a>
            }
          </div>
        }
      </div>
    } @else {
      <p class="text-muted" i18n="@@evolution.none">This Pokémon does not evolve.</p>
    }
  `,
  styleUrl: './evolution-chain.component.css',
})
export class EvolutionChainComponent {
  readonly stages = input.required<EvolutionStage[][]>();

  protected readonly steps = computed(() =>
    this.stages().map(step =>
      step.map(stage => ({ ...stage, condition: stage.condition ? evolutionConditionLabel(stage.condition) : null })),
    ),
  );
}
