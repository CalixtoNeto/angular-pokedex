import { Component, LOCALE_ID, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { LanguagePickerComponent } from '@pokedex/ui';
import { LANGUAGES } from './languages';

@Component({
  selector: 'app-root',
  template: `
    <app-language-picker [languages]="languages" [current]="locale" [path]="path()" />
    <router-outlet />
  `,
  imports: [RouterOutlet, LanguagePickerComponent],
})
export class AppComponent {
  private readonly router = inject(Router);

  protected readonly languages = LANGUAGES;
  protected readonly locale = inject(LOCALE_ID);
  // A página atual, para o seletor levar à mesma página no outro idioma.
  protected readonly path = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: '/' },
  );
}
