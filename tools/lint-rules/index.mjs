import { dumbComponent } from './rules/dumb-component.mjs';

// Plugin local com as regras do projeto. Registrado como "pokedex" nos eslint.config.mjs.
export default { rules: { 'dumb-component': dumbComponent } };
