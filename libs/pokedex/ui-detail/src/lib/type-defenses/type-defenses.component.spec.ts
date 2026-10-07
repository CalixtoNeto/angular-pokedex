import { TestBed } from '@angular/core/testing';
import { typeDefenses } from '@pokedex/domain';
import { TypeDefensesComponent } from './type-defenses.component';

describe('TypeDefensesComponent', () => {
  function render(types: string[]) {
    const fixture = TestBed.createComponent(TypeDefensesComponent);
    fixture.componentRef.setInput('defenses', typeDefenses(types));
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    return (group: string) => [...element.querySelectorAll(`[data-defense="${group}"] li`)].map(li => li.textContent?.trim());
  }

  it('agrupa fraquezas, resistências e imunidades com o multiplicador', () => {
    const items = render(['fire', 'flying']);
    expect(items('weak')).toEqual(['Water ×2', 'Electric ×2', 'Rock ×4']);
    expect(items('immune')).toEqual(['Ground ×0']);
  });

  it('cada tipo leva a cor dele', () => {
    const fixture = TestBed.createComponent(TypeDefensesComponent);
    fixture.componentRef.setInput('defenses', typeDefenses(['normal']));
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-defense="weak"] li')?.classList).toContain('bg-fighting');
  });
});
