import { TestBed } from '@angular/core/testing';
import { Rarity } from '@pokedex/domain';
import { RarityBadgeComponent } from './rarity-badge.component';

describe('RarityBadgeComponent', () => {
  function render(rarity: Rarity | null) {
    const fixture = TestBed.createComponent(RarityBadgeComponent);
    fixture.componentRef.setInput('rarity', rarity);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('.rarity');
  }

  it('mostra o selo de lendário, mítico ou bebê', () => {
    expect(render('legendary')?.textContent?.trim()).toBe('Legendary');
    expect(render('mythical')?.textContent?.trim()).toBe('Mythical');
    expect(render('baby')?.classList).toContain('rarity-baby');
  });

  it('Pokémon comum não tem selo', () => {
    expect(render(null)).toBeNull();
  });
});
