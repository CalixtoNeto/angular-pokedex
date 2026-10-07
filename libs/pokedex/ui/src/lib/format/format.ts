export const pokedexNumber = (id: number) => `#${String(id).padStart(3, '0')}`;

const FRACTIONS: Record<number, string> = { 0.5: '½', 0.25: '¼' };

export const formatMultiplier = (multiplier: number) => `×${FRACTIONS[multiplier] ?? multiplier}`;

export const titleCaseSlug = (slug: string) =>
  slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
