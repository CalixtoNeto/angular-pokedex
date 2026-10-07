import { Component, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EvolutionStage } from '@pokedex/domain';

@Component({
  selector: 'app-evolution-chain',
  imports: [RouterLink, TitleCasePipe],
  template: `
    @if (stages().length > 1) {
      <div class="evolution-chain">
        @for (step of stages(); track $index) {
          <div class="evolution-step">
            @for (stage of step; track stage.id) {
              <a class="evolution-stage" [routerLink]="['/pokemon', stage.name]">
                <img [src]="stage.image" [alt]="stage.name" loading="lazy" />
                <span class="name">{{ stage.name | titlecase }}</span>
                @if (stage.condition) {
                  <small class="condition">{{ stage.condition }}</small>
                }
              </a>
            }
          </div>
        }
      </div>
    } @else {
      <p class="text-muted">This Pokémon does not evolve.</p>
    }
  `,
  styleUrl: './evolution-chain.component.css',
})
export class EvolutionChainComponent {
  readonly stages = input.required<EvolutionStage[][]>();
}
