import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { dumbComponent } from './dumb-component.mjs';

const ruleTester = new RuleTester({ languageOptions: { parser: tseslint.parser } });

ruleTester.run('dumb-component', dumbComponent, {
  valid: [
    {
      name: 'componente que só recebe dados por input() e avisa por output()',
      code: `
        @Component({ selector: 'app-card', template: '' })
        export class Card {
          readonly pokemon = input.required<Pokemon>();
          readonly selected = output<number>();
        }`,
    },
    {
      name: 'função pura de apoio fora de componente',
      code: `export const total = (stats: number[]) => stats.reduce((a, b) => a + b, 0);`,
    },
  ],
  invalid: [
    {
      name: 'inject() dentro do componente',
      code: `
        @Component({ selector: 'app-card', template: '' })
        export class Card { private readonly store = inject(PokedexStore); }`,
      errors: [{ messageId: 'noInject' }],
    },
    {
      name: 'dependência pelo construtor',
      code: `
        @Component({ selector: 'app-card', template: '' })
        export class Card { constructor(private http: HttpClient) {} }`,
      errors: [{ messageId: 'noConstructorInjection' }],
    },
    {
      name: 'HttpClient importado na ui',
      code: `import { HttpClient } from '@angular/common/http';`,
      errors: [{ messageId: 'noHttp' }],
    },
  ],
});
