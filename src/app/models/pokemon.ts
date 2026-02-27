export interface Pokemon {
  image: string;
  number: number;
  name: string;
  types: Array<{ type: { name: string } }>;
}
