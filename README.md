# Pokédex em Angular

Lista os Pokémon de cada região (Kanto, Johto, …) a partir da [PokeAPI](https://pokeapi.co/), com busca por nome,
e mostra o detalhe de cada um: stats base, cadeia de evolução, selo de raridade (lendário, mítico, bebê) e
fraquezas e resistências calculadas pelos tipos.

Projeto de estudo. Começou em Angular 12 e foi atualizado, uma versão por vez, até o Angular 22, com componentes
standalone, estado em signals e sem zone.js.

## Rodando

Requer Node 24 (veja `.nvmrc`).

```bash
npm ci
npm start          # http://localhost:4200
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
