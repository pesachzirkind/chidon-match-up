import { v4 as uuidv4 } from 'uuid';
import type { Mitzvah, Card, CardType, LevelConfig } from '../types';
import { shuffleArray } from './shuffle';

/**
 * Extract the correct text from mitzvah based on card type
 */
export function getCardDisplayText(mitzvah: Mitzvah, cardType: CardType): string {
  switch (cardType) {
    case 'hebrew_name':
      return mitzvah.hebrew_name;
    case 'english_name':
      return mitzvah.english_name;
    case 'who_applies':
      return mitzvah.who_applies;
    case 'when_applies':
      return mitzvah.when_applies;
    case 'where_applies':
      return mitzvah.where_applies;
    case 'punishment':
      return mitzvah.punishment;
    default:
      return '';
  }
}

/**
 * Generate cards for a level from mitzvah data
 * - Select random subset of mitzvos based on level card count
 * - Create two cards per mitzvah (type A and type B per level rules)
 * - Assign unique UUIDs to each card
 * - Returns shuffled array of cards
 */
export function generateCardsForLevel(
  mitzvos: Mitzvah[],
  levelConfig: LevelConfig
): Card[] {
  // Calculate how many pairs we need (between min and max, but even number for pairs)
  const minPairs = Math.floor(levelConfig.min_cards / 2);
  const maxPairs = Math.floor(levelConfig.max_cards / 2);
  const availablePairs = Math.min(mitzvos.length, maxPairs);
  const numPairs = Math.max(minPairs, Math.min(availablePairs, maxPairs));
  
  // Shuffle and select mitzvos
  const shuffledMitzvos = shuffleArray(mitzvos);
  const selectedMitzvos = shuffledMitzvos.slice(0, numPairs);
  
  // Create cards
  const cards: Card[] = [];
  
  for (const mitzvah of selectedMitzvos) {
    // Get the attribute value that both cards need to match on
    const attributeValue = getCardDisplayText(mitzvah, levelConfig.card_type_b);
    
    // Create card type A (e.g., english_name)
    // match_key = the expected attribute value from the mitzvah
    const cardA: Card = {
      card_id: uuidv4(),
      mitzvah_id: mitzvah.mitzvah_id,
      card_type: levelConfig.card_type_a,
      display_text: getCardDisplayText(mitzvah, levelConfig.card_type_a),
      match_key: attributeValue,
      is_selected: false,
      is_matched: false,
    };
    
    // Create card type B (e.g., who_applies)
    // match_key = the display_text (attribute value itself)
    const cardB: Card = {
      card_id: uuidv4(),
      mitzvah_id: mitzvah.mitzvah_id,
      card_type: levelConfig.card_type_b,
      display_text: attributeValue,
      match_key: attributeValue,
      is_selected: false,
      is_matched: false,
    };
    
    cards.push(cardA, cardB);
  }
  
  // Shuffle the cards
  return shuffleArray(cards);
}

export default generateCardsForLevel;
