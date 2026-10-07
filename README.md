# Pokédex em Angular

Lista os Pokémon de cada região (Kanto, Johto, …) a partir da [PokeAPI](https://pokeapi.co/), com busca por nome,
e mostra o detalhe de cada um: stats base, cadeia de evolução, selo de raridade (lendário, mítico, bebê) e
fraquezas e resistências calculadas pelos tipos.

Em inglês, português e espanhol: `/` (inglês), `/pt/` e `/es/`, com um seletor de idioma em cada página.

Projeto de estudo. Começou em Angular 12 e foi atualizado, uma versão por vez, até o Angular 22, com componentes
standalone, estado em signals e sem zone.js.

## Rodando

Requer Node 24 (veja `.nvmrc`).

```bash
npm ci
npm start          # http://localhost:4200, em inglês
npx nx serve -c pt # em português (ou -c es); o servidor de desenvolvimento serve um idioma por vez
```

## Testes

```bash
npm run lint       # fronteiras entre libs e regras do projeto
npm run test:ci    # unitários (Vitest, no Node) com cobertura mínima por arquivo
npm run build
npm run e2e        # ponta a ponta (Playwright, com respostas reais da PokeAPI como fixture)
```

Os testes ponta a ponta sobem o app compilado num Chromium e respondem no lugar da PokeAPI com dados fixos
(`e2e/fixtures/pokeapi.ts`). Eles foram escritos contra a versão em Angular 12, antes da atualização, e
garantem que o comportamento continuou o mesmo em todas as versões.

Para instalar o Chromium do Playwright na primeira vez: `npx playwright install chromium`.

## Idiomas

Tradução com a i18n oficial do Angular (`@angular/localize`), feita no build: cada idioma é um build próprio,
sem custo de tradução em tempo de execução, com `<html lang>` e formato de números (0,7 m; 87,5%) do idioma.

| Idioma | Endereço | Arquivo de tradução |
|---|---|---|
| Inglês (origem) | `/` | o próprio código |
| Português (Brasil) | `/pt/` | `src/locale/messages.pt-BR.xlf` |
| Espanhol | `/es/` | `src/locale/messages.es.xlf` |

- Textos do app ficam no código em inglês, marcados com `i18n="descrição@@id"` nos templates e
  `` $localize`:descrição@@id:texto` `` no TypeScript. O lint (`@angular-eslint/template/i18n`) barra texto sem marcação.
- `npm run i18n:extract` atualiza `src/locale/messages.xlf`; as traduções novas vão para os dois arquivos de idioma.
  O build falha se faltar alguma (`i18nMissingTranslation: error`).
- Textos da PokeAPI (espécie e descrição) vêm no idioma do site quando a API os tem (espanhol tem; português, não)
  e caem para o inglês. Habilidades, grupos de ovo e itens vêm em inglês. Texto em outro idioma leva o atributo
  `lang`, para o leitor de tela pronunciar certo.
- O build avisa que usa os dados de `pt` para `pt-BR`: é esperado (no Angular, `pt` já é o português do Brasil).

## Organização

Monorepo Nx. As fronteiras entre libs são impostas pelo lint (`@nx/enforce-module-boundaries`):

| Lib | Pode importar | O que tem |
|---|---|---|
| `libs/pokedex/domain` | nada | Modelo, contrato `PokemonRepository`, tabela de tipos e funções puras |
| `libs/pokedex/data-access` | domain | Implementação do contrato com a PokeAPI, mapeamento e cache |
| `libs/pokedex/ui`, `ui-detail` | domain, ui | Componentes só com `input()`; a regra `pokedex/dumb-component` barra `inject()` e HTTP |
| `libs/pokedex/feature-list`, `feature-detail` | domain, ui | Telas (componentes smart) e o estado em signals |
| `src/` (app) | todas | Rotas e a escolha da implementação (`providePokeApi()`) |
| `tools/lint-rules` | | Regras de ESLint do projeto, com testes |
| `e2e/` | | Testes ponta a ponta e a PokeAPI simulada |
