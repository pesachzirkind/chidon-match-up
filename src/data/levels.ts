import type { LevelConfig } from '../types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: 'Hebrew ↔ English',
    card_type_a: 'hebrew_name',
    card_type_b: 'english_name',
    min_cards: 8,
    max_cards: 12,
    description: 'Match Hebrew mitzvah names to their English translations'
  },
  {
    level: 2,
    name: 'Who Does It Apply To?',
    card_type_a: 'english_name',
    card_type_b: 'who_applies',
    min_cards: 10,
    max_cards: 14,
    description: 'Match mitzvos to who they apply to'
  },
  {
    level: 3,
    name: 'When Does It Apply?',
    card_type_a: 'english_name',
    card_type_b: 'when_applies',
    min_cards: 12,
    max_cards: 16,
    description: 'Match mitzvos to when they apply'
  },
  {
    level: 4,
    name: 'Where Does It Apply?',
    card_type_a: 'english_name',
    card_type_b: 'where_applies',
    min_cards: 14,
    max_cards: 18,
    description: 'Match mitzvos to where they apply'
  },
  {
    level: 5,
    name: 'What\'s the Punishment?',
    card_type_a: 'english_name',
    card_type_b: 'punishment',
    min_cards: 16,
    max_cards: 20,
    description: 'Match mitzvos to their punishments'
  }
];

export const getLevelConfig = (level: number): LevelConfig | undefined => {
  return LEVEL_CONFIGS.find(config => config.level === level);
};

export default LEVEL_CONFIGS;
