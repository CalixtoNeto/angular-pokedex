# Pokédex em Angular (monorepo Nx)

App estático em Angular 22 (standalone, signals, sem zone.js): lista Pokémon por região e mostra o detalhe de
cada um (stats, evoluções, raridade, fraquezas), a partir da PokeAPI. Em inglês (`/`), português (`/pt/`) e
espanhol (`/es/`).

## Antes de dar uma mudança por pronta

Rode, nesta ordem (Node 24, veja `.nvmrc`):

1. `npm run lint`: fronteiras entre libs, regra própria `pokedex/dumb-component`, tamanho e complexidade.
2. `npm run test:ci`: testes unitários (Vitest, sem navegador) com cobertura mínima **por arquivo**.
3. `npm run build`
4. `npm run e2e`: Playwright com a PokeAPI simulada pelas respostas reais em
   `libs/pokedex/data-access/src/testing/pokeapi/`. Nada sai para a rede.

Na CI, depois dos unitários, o SonarQube Cloud analisa o código e a cobertura (`sonar-project.properties`) e
reprova pelo Quality Gate. Lib nova com testes: acrescente o `coverage/<projeto>/lcov.info` dela em
`sonar.javascript.lcov.reportPaths`.

Nenhum desses gates se desliga para fazer uma mudança passar. Se um deles barrar, a mudança está errada ou o
teste que falta ainda não foi escrito. Não afrouxe `eslint.base.config.mjs`, `nx.json` (cobertura) nem
`tsconfig.base.json` sem que isso seja o objetivo da tarefa.

Os testes em `e2e/` descrevem o comportamento visto de fora. Se um deles falhar depois de uma refatoração,
corrija o código, não o teste.

## Fluxo para uma funcionalidade nova

1. Escreva o teste ponta a ponta do que o usuário vai ver e veja falhar.
2. Desça camada por camada, sempre com o teste antes do código: `domain` (modelo e regras puras),
   `data-access` (mapeamento testado contra as respostas reais), `ui`/`ui-detail` (componentes dumb),
   `feature-*` (componentes smart).
3. Resposta nova da PokeAPI: baixe do espelho `PokeAPI/api-data` e recorte só os campos usados.

## Textos e idiomas

i18n oficial do Angular (`@angular/localize`), no build: um bundle por idioma, configurado em `"i18n"` no
`project.json` (o inglês é a origem e fica na raiz). A lista do seletor (`src/app/languages.ts`) tem de bater com ele.

- Texto visível novo: em inglês, com id fixo. Template: `i18n="descrição@@area.chave"` (ou `i18n-placeholder`,
  `i18n-aria-label`); TypeScript: `` $localize`:descrição@@area.chave:Texto` ``. O lint barra texto sem `i18n` ou sem id.
- Depois, `npm run i18n:extract` e a tradução nos dois arquivos `src/locale/messages.{pt-BR,es}.xlf`. O build
  falha se faltar uma.
- O domínio guarda dado, não texto pronto ("Lv. 16" é `{ kind: 'level', level: 16 }`); quem escreve é a ui.
- Números pelos pipes (`number`, `percent`), que seguem o `LOCALE_ID`. Nunca monte "0.7" com template string.
- Textos da PokeAPI: o data-access escolhe o idioma pelo `LOCALE_ID`, com o inglês como reserva, e diz qual veio
  (`textLanguage`). Texto que pode estar em outro idioma leva `lang` no HTML.
- Os testes unitários rodam no idioma de origem (inglês); os outros idiomas são cobertos em `e2e/idiomas.spec.ts`.

## Libs e fronteiras (impostas pelo lint)

| Lib | Tag | Pode importar | O que tem |
|---|---|---|---|
| `@pokedex/domain` | `type:domain` | nada | Modelo, `PokemonRepository` (contrato), `typeDefenses`, funções puras |
| `@pokedex/data-access` | `type:data-access` | domain | `PokeApiPokemonRepository`, mapeamento, cache, `providePokeApi()` |
| `@pokedex/ui`, `@pokedex/ui-detail` | `type:ui` | domain, ui | Componentes dumb: só `input()`/`output()`, sem `inject()` nem HTTP; nomes de tipos e seletor de idioma |
| `@pokedex/feature-list`, `@pokedex/feature-detail` | `type:feature` | domain, ui | Componentes smart e stores; dependem do contrato, nunca da API |
| app (`src/`) | `type:app` | todas | Rotas, `providePokeApi()` (o único lugar que escolhe a implementação) e os idiomas do site |

- Estado em `signal`/`computed`; dados assíncronos com `rxResource` ou `toSignal`. Sem zone.js.
- Componente dumb que precisa de dado novo ganha um `input()`; quem busca é a feature.
- Uma lib por área carregada sob demanda: importar um barrel grande numa rota lazy puxa tudo para o bundle inicial.
- Os nomes curtos dos componentes (`app-*`) e as classes `.card-title`/`.badge` são usados pelos testes ponta a ponta.
