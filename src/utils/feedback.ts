import type { Mitzvah, LevelConfig } from '../types';

/**
 * Generate educational feedback message based on the correct attribute
 */
export function generateFeedbackMessage(
  mitzvah: Mitzvah,
  levelConfig: LevelConfig
): string {
  const mitzvahName = mitzvah.english_name;
  
  switch (levelConfig.card_type_b) {
    case 'english_name':
      return `"${mitzvah.hebrew_name}" means "${mitzvahName}" in English.`;
    
    case 'who_applies':
      return `"${mitzvahName}" applies to: ${mitzvah.who_applies}`;
    
    case 'when_applies':
      return `"${mitzvahName}" applies: ${mitzvah.when_applies}`;
    
    case 'where_applies':
      return `"${mitzvahName}" applies: ${mitzvah.where_applies}`;
    
    case 'punishment':
      if (mitzvah.punishment === 'Not Applicable' || !mitzvah.punishment) {
        return `"${mitzvahName}" has no specific punishment listed.`;
      }
      return `The punishment for violating "${mitzvahName}" is: ${mitzvah.punishment}`;
    
    default:
      return `Learn more about "${mitzvahName}"!`;
  }
}

/**
 * Get a card type label for display
 */
export function getCardTypeLabel(cardType: string): string {
  switch (cardType) {
    case 'hebrew_name':
      return 'Hebrew Name';
    case 'english_name':
      return 'English Name';
    case 'who_applies':
      return 'Who';
    case 'when_applies':
      return 'When';
    case 'where_applies':
      return 'Where';
    case 'punishment':
      return 'Punishment';
    default:
      return cardType;
  }
}

export default generateFeedbackMessage;
