import { BaseStat } from './pokemon-detail';

export const statTotal = (stats: BaseStat[]) => stats.reduce((total, stat) => total + stat.value, 0);
