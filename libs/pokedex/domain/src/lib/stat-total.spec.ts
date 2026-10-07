import { statTotal } from './stat-total';

describe('statTotal', () => {
  it('soma os stats base', () => {
    expect(statTotal([{ name: 'hp', value: 45 }, { name: 'attack', value: 49 }])).toBe(94);
  });

  it('sem stats, o total é zero', () => {
    expect(statTotal([])).toBe(0);
  });
});
