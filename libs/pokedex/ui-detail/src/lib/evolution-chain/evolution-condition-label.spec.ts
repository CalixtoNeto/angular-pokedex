import { evolutionConditionLabel } from './evolution-condition-label';

describe('evolutionConditionLabel', () => {
  it('nível e amizade são textos do app, traduzidos', () => {
    expect(evolutionConditionLabel({ kind: 'level', level: 16 })).toEqual({ text: 'Lv. 16', lang: null });
    expect(evolutionConditionLabel({ kind: 'friendship' })).toEqual({ text: 'Friendship', lang: null });
  });

  it('gatilhos conhecidos são traduzidos; os demais aparecem com o nome da API, em inglês', () => {
    expect(evolutionConditionLabel({ kind: 'trigger', trigger: 'trade' })).toEqual({ text: 'Trade', lang: null });
    expect(evolutionConditionLabel({ kind: 'trigger', trigger: 'three-critical-hits' })).toEqual({ text: 'Three Critical Hits', lang: 'en' });
  });

  it('itens vêm da PokeAPI só em inglês e são marcados assim', () => {
    expect(evolutionConditionLabel({ kind: 'item', item: 'thunder-stone' })).toEqual({ text: 'Thunder Stone', lang: 'en' });
  });
});
