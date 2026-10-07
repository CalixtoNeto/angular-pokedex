import { TestBed } from '@angular/core/testing';
import { BaseStat } from '@pokedex/domain';
import { StatBarsComponent } from './stat-bars.component';

const BULBASAUR: BaseStat[] = [
  { name: 'hp', value: 45 }, { name: 'attack', value: 49 }, { name: 'defense', value: 49 },
  { name: 'special-attack', value: 65 }, { name: 'special-defense', value: 65 }, { name: 'speed', value: 45 },
];

describe('StatBarsComponent', () => {
  function render(stats: BaseStat[]) {
    const fixture = TestBed.createComponent(StatBarsComponent);
    fixture.componentRef.setInput('stats', stats);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('uma linha por stat, com o nome curto, e o total no fim', () => {
    const rows = [...render(BULBASAUR).querySelectorAll('tr')]
      .map(row => [...row.querySelectorAll('th, .value')].map(cell => cell.textContent?.trim()).join(' '));
    expect(rows).toEqual(['HP 45', 'Attack 49', 'Defense 49', 'Sp. Atk 65', 'Sp. Def 65', 'Speed 45', 'Total 318']);
  });

  it('a barra é proporcional ao stat e marca os valores baixos', () => {
    const bars = [...render(BULBASAUR).querySelectorAll<HTMLElement>('.stat-bar span')];
    expect(bars[0]?.style.width).toBe('25%');
    expect(bars[0]?.classList).toContain('low');
    expect(bars[3]?.classList).not.toContain('low');
  });
});
