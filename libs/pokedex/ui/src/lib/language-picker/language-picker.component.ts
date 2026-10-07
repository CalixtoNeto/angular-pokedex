import { Component, computed, input } from '@angular/core';

export interface LanguageOption {
  // Tag BCP 47, a mesma do LOCALE_ID do build daquele idioma.
  code: string;
  // O nome do idioma nele mesmo ("Português"), para quem não lê o idioma atual achar o seu.
  label: string;
  // Pasta do build do idioma ("pt"); vazio para o idioma de origem, servido na raiz.
  pathPrefix: string;
}

// Cada idioma é um build separado, então trocar de idioma é um link comum (recarrega a página), não uma rota.
@Component({
  selector: 'app-language-picker',
  template: `
    <nav class="language-picker" aria-label="Language" i18n-aria-label="@@languagePicker.label">
      @for (language of links(); track language.code) {
        <a
          [href]="language.href"
          [attr.lang]="language.code"
          [attr.hreflang]="language.code"
          [attr.aria-current]="language.current ? 'page' : null"
          [class.active]="language.current"
          >{{ language.label }}</a
        >
      }
    </nav>
  `,
  styles: `
    .language-picker { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 0.5rem 1rem; font-size: 0.875rem; }
    a { color: inherit; text-decoration: none; opacity: 0.7; }
    a.active { font-weight: 600; opacity: 1; }
    a:hover, a:focus-visible { text-decoration: underline; opacity: 1; }
  `,
})
export class LanguagePickerComponent {
  readonly languages = input.required<LanguageOption[]>();
  readonly current = input.required<string>();
  // Caminho da página atual dentro do app ("/pokemon/bulbasaur"), sem a pasta do idioma.
  readonly path = input.required<string>();

  protected readonly links = computed(() =>
    this.languages().map(({ code, label, pathPrefix }) => ({
      code,
      label,
      href: pathPrefix ? `/${pathPrefix}${this.path()}` : this.path(),
      current: code === this.current(),
    })),
  );
}
