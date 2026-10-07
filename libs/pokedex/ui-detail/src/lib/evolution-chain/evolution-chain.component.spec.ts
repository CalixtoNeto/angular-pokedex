import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EvolutionStage } from '@pokedex/domain';
import { EvolutionChainComponent } from './evolution-chain.component';

const stage = (id: number, name: string, condition: string | null): EvolutionStage => ({ id, name, image: `/${id}.png`, condition });

describe('EvolutionChainComponent', () => {
  function render(stages: EvolutionStage[][]) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(EvolutionChainComponent);
    fixture.componentRef.setInput('stages', stages);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('cada etapa é um link para o detalhe, com a condição de evolução', () => {
    const links = [...render([[stage(172, 'pichu', null)], [stage(25, 'pikachu', 'Friendship')]]).querySelectorAll('a')];
    expect(links.map(a => a.getAttribute('href'))).toEqual(['/pokemon/pichu', '/pokemon/pikachu']);
    expect(links.map(a => [a.querySelector('.name')?.textContent?.trim(), a.querySelector('.condition')?.textContent?.trim()]))
      .toEqual([['Pichu', undefined], ['Pikachu', 'Friendship']]);
  });

  it('evoluções ramificadas ficam na mesma coluna', () => {
    const columns = render([[stage(133, 'eevee', null)], [stage(134, 'vaporeon', 'Water Stone'), stage(135, 'jolteon', 'Thunder Stone')]])
      .querySelectorAll('.evolution-step');
    expect([...columns].map(column => column.querySelectorAll('a').length)).toEqual([1, 2]);
  });

  it('um Pokémon que não evolui avisa em vez de mostrar uma lista de um', () => {
    expect(render([[stage(150, 'mewtwo', null)]]).textContent).toContain('does not evolve');
  });
});
