import { TestBed } from '@angular/core/testing';
import { LanguageOption, LanguagePickerComponent } from './language-picker.component';

const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', label: 'English', pathPrefix: '' },
  { code: 'pt-BR', label: 'Português', pathPrefix: 'pt' },
];

describe('LanguagePickerComponent', () => {
  function render(path: string) {
    const fixture = TestBed.createComponent(LanguagePickerComponent);
    fixture.componentRef.setInput('languages', LANGUAGES);
    fixture.componentRef.setInput('current', 'pt-BR');
    fixture.componentRef.setInput('path', path);
    fixture.detectChanges();
    return [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')];
  }

  it('cada idioma leva à mesma página na pasta dele; o de origem fica na raiz', () => {
    expect(render('/pokemon/bulbasaur').map(a => a.getAttribute('href'))).toEqual(['/pokemon/bulbasaur', '/pt/pokemon/bulbasaur']);
    expect(render('/').map(a => a.getAttribute('href'))).toEqual(['/', '/pt/']);
  });

  it('cada link se anuncia no próprio idioma e marca o atual', () => {
    const [english, portugues] = render('/');
    expect(english?.textContent?.trim()).toBe('English');
    expect(english?.getAttribute('lang')).toBe('en-US');
    expect(english?.getAttribute('hreflang')).toBe('en-US');
    expect(english?.hasAttribute('aria-current')).toBe(false);
    expect(portugues?.getAttribute('aria-current')).toBe('page');
  });
});
