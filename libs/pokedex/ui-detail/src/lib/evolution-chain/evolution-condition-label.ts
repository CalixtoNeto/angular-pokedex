import { EvolutionCondition } from '@pokedex/domain';
import { titleCaseSlug } from '@pokedex/ui';

// lang: idioma do texto quando ele não é o do site. Nomes de item e gatilhos raros vêm da PokeAPI só em inglês.
export interface ConditionLabel {
  text: string;
  lang: 'en' | null;
}

const TRIGGERS: Partial<Record<string, string>> = {
  trade: $localize`:Evolution trigger@@evolution.trade:Trade`,
  'level-up': $localize`:Evolution trigger@@evolution.levelUp:Level up`,
  'use-item': $localize`:Evolution trigger@@evolution.useItem:Use item`,
};

const translated = (text: string): ConditionLabel => ({ text, lang: null });
const fromApi = (slug: string): ConditionLabel => ({ text: titleCaseSlug(slug), lang: 'en' });

export function evolutionConditionLabel(condition: EvolutionCondition): ConditionLabel {
  switch (condition.kind) {
    case 'level':
      return translated($localize`:Evolves at this level, abbreviated@@evolution.level:Lv. ${condition.level}:level:`);
    case 'friendship':
      return translated($localize`:Evolves with high friendship@@evolution.friendship:Friendship`);
    case 'item':
      return fromApi(condition.item);
    case 'trigger': {
      const label = TRIGGERS[condition.trigger];
      return label ? translated(label) : fromApi(condition.trigger);
    }
  }
}
