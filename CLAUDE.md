# Pokédex em Angular

App estático em Angular 22 (standalone, signals, sem zone.js) que lista Pokémon por região a partir da PokeAPI.

## Antes de dar uma mudança por pronta

Rode, nesta ordem (Node 24, veja `.nvmrc`):

1. `npm test`: testes unitários com Vitest, no Node, sem navegador.
2. `npm run build`
3. `npm run e2e`: Playwright abre o app compilado num Chromium e simula a PokeAPI (`e2e/fixtures/pokeapi.ts`).
   Nada sai para a rede, então rodam igual em qualquer máquina.

Os testes em `e2e/` descrevem o comportamento visto de fora e não dependem de como o app é escrito.
Se um deles falhar depois de uma refatoração, o comportamento mudou: corrija o código, não o teste.
Só mude um teste em `e2e/` quando a mudança de comportamento for o objetivo da tarefa, e diga isso no resumo.

Regra nova: escreva primeiro o teste unitário ao lado do arquivo (`*.spec.ts`), veja falhar, depois o código.

## Como o código está organizado

- `src/app/pokeapi/`: acesso à PokeAPI (`PokeApiClient`), tipos das respostas e o interceptor de cache.
- `src/app/pokedex/`: modelo do domínio, funções puras (`toPokemon`, `filterByName`) e o `PokedexStore` com o estado em signals.
- `src/app/pokemon-list/` e `src/app/pokemon-card/`: componentes, sem lógica além de ler o store.
- Estado novo vai para o store como `signal`/`computed`; dados assíncronos entram com `rxResource` ou `toSignal`.
- Componentes usam `input()`, `inject()` e a detecção de mudanças padrão (OnPush). Não há zone.js: algo que
  muda fora de um signal não aparece na tela.
- Arquivos curtos, funções curtas, nomes que dizem o que a coisa é. Comentário só para o porquê.
