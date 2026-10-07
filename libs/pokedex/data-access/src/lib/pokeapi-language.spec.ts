import { pokeApiLanguages, toLanguageTag } from './pokeapi-language';

describe('idiomas da PokeAPI', () => {
  it('do LOCALE_ID do Angular para os códigos da PokeAPI, em ordem de preferência e com o inglês por último', () => {
    expect(pokeApiLanguages('pt-BR')).toEqual(['pt-br', 'pt', 'en']);
    expect(pokeApiLanguages('es')).toEqual(['es', 'en']);
    expect(pokeApiLanguages('en-US')).toEqual(['en-us', 'en']);
  });

  it('de volta para uma tag de idioma (BCP 47), usada no atributo lang', () => {
    expect(toLanguageTag('pt-br')).toBe('pt-BR');
    expect(toLanguageTag('es')).toBe('es');
    expect(toLanguageTag('es-419')).toBe('es-419');
  });
});
