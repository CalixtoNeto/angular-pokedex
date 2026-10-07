// Componentes de @pokedex/ui são dumb: recebem dados por input() e avisam por output().
// Quem busca dado, injeta serviço ou fala com a API é a feature. A tag type:ui já impede
// importar outras libs; esta regra fecha o atalho que sobra, que é injetar direto do Angular.

const isComponentClass = node =>
  (node.decorators ?? []).some(
    decorator => decorator.expression.type === 'CallExpression' && decorator.expression.callee.name === 'Component',
  );

export const dumbComponent = {
  meta: {
    type: 'problem',
    docs: { description: 'Componentes de ui não injetam dependências nem falam com HTTP.' },
    schema: [],
    messages: {
      noInject: 'Componente de ui não usa inject(). Receba o dado por input() e deixe a feature buscá-lo.',
      noConstructorInjection: 'Componente de ui não recebe dependências pelo construtor. Use input() e output().',
      noHttp: 'A ui não fala com HTTP. O acesso à API fica em @pokedex/data-access, atrás do PokemonRepository.',
    },
  },
  create(context) {
    const componentStack = [];
    const insideComponent = () => componentStack.at(-1) === true;
    return {
      ClassDeclaration: node => componentStack.push(isComponentClass(node)),
      'ClassDeclaration:exit': () => componentStack.pop(),
      ImportDeclaration(node) {
        if (node.source.value.startsWith('@angular/common/http')) context.report({ node, messageId: 'noHttp' });
      },
      CallExpression(node) {
        if (insideComponent() && node.callee.type === 'Identifier' && node.callee.name === 'inject') {
          context.report({ node, messageId: 'noInject' });
        }
      },
      MethodDefinition(node) {
        if (insideComponent() && node.kind === 'constructor' && node.value.params.length > 0) {
          context.report({ node, messageId: 'noConstructorInjection' });
        }
      },
    };
  },
};
