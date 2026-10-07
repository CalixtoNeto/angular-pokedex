export function filterByName<T extends { name: string }>(items: T[], term: string): T[] {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) return items;
  return items.filter(item => item.name.toLowerCase().includes(normalizedTerm));
}
