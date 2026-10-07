# Pokédex em Angular

Lista os Pokémon de cada região (Kanto, Johto, …) a partir da [PokeAPI](https://pokeapi.co/), com busca por nome.

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
npm test           # unitários (Vitest, no Node)
npm run build
npm run e2e        # ponta a ponta (Playwright, com a PokeAPI simulada)
```

Os testes ponta a ponta sobem o app compilado num Chromium e respondem no lugar da PokeAPI com dados fixos
(`e2e/fixtures/pokeapi.ts`). Eles foram escritos contra a versão em Angular 12, antes da atualização, e
garantem que o comportamento continuou o mesmo em todas as versões.

Para instalar o Chromium do Playwright na primeira vez: `npx playwright install chromium`.

## Organização

| Pasta | O que tem |
|---|---|
| `src/app/pokeapi/` | Acesso à PokeAPI, tipos das respostas e cache dos GET |
| `src/app/pokedex/` | Modelo, funções puras e o store com o estado em signals |
| `src/app/pokemon-list/`, `src/app/pokemon-card/` | Componentes |
| `e2e/` | Testes ponta a ponta e a PokeAPI simulada |
