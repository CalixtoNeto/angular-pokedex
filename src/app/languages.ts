import { LanguageOption } from '@pokedex/ui';

// Os idiomas do site. Tem de bater com "i18n" no project.json: code é o locale e pathPrefix, o subPath do build.
export const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', label: 'English', pathPrefix: '' },
  { code: 'pt-BR', label: 'Português', pathPrefix: 'pt' },
  { code: 'es', label: 'Español', pathPrefix: 'es' },
];
