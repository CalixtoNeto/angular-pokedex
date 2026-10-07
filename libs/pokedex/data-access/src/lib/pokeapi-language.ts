// A PokeAPI identifica idiomas em minúsculas ("pt-br", "es"); o Angular usa tags BCP 47 ("pt-BR").

// Do mais específico ao mais geral, e o inglês por último: é o idioma que a PokeAPI sempre tem.
export function pokeApiLanguages(localeId: string): string[] {
  const exact = localeId.toLowerCase();
  const base = exact.replace(/-.*$/, '');
  return [...new Set([exact, base, 'en'])];
}

export const toLanguageTag = (pokeApiLanguage: string) =>
  pokeApiLanguage.replace(/-([a-z]{2})$/, (_, region: string) => `-${region.toUpperCase()}`);
