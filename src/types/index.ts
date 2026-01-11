// Core mitzvah entity from data source
export interface Mitzvah {
  mitzvah_id: string;        // e.g., "189" from Card Number column
  hebrew_name: string;       // Hebrew Title column
  english_name: string;      // English Title column
  who_applies: string;       // Who column
  when_applies: string;      // When column
  where_applies: string;     // Where column
  punishment: string;        // Punishment column (may be "Not Applicable")
}

// Card types that can appear in the game
export type CardType = 
  | 'hebrew_name' 
  | 'english_name' 
  | 'who_applies' 
  | 'when_applies' 
  | 'where_applies' 
  | 'punishment';

// Individual card in the game
export interface Card {
  card_id: string;           // UUID generated at runtime
  mitzvah_id: string;        // Reference to parent mitzvah
  card_type: CardType;       // Which attribute this card represents
  display_text: string;      // Text shown on card face
  is_selected: boolean;      // Whether card is currently selected for matching
  is_matched: boolean;       // Whether card has been matched (will be hidden)
}

// Level configuration
export interface LevelConfig {
  level: number;             // 1-5
  name: string;              // Display name for level
  card_type_a: CardType;     // First card type in pair
  card_type_b: CardType;     // Second card type in pair
  min_cards: number;         // Minimum cards for this level
  max_cards: number;         // Maximum cards for this level
  description: string;       // Short description for level select
}

// Game state managed by context
export interface GameState {
  currentLevel: number | null;
  cards: Card[];
  selectedCards: Card[];     // Currently selected (max 2)
  matchedPairs: number;
  totalPairs: number;
  score: number;
  combo: number;             // Current streak count
  moves: number;             // Total moves made
  startTime: number | null;  // Timestamp when timer started
  elapsedTime: number;       // Elapsed seconds since game start
  gameStatus: 'idle' | 'playing' | 'checking' | 'complete';
  feedbackMessage: string | null;
  feedbackMitzvah: Mitzvah | null;
}

// Actions for game reducer
export type GameAction =
  | { type: 'START_GAME'; payload: { level: number; cards: Card[]; totalPairs: number } }
  | { type: 'SELECT_CARD'; payload: { cardId: string } }
  | { type: 'CHECK_MATCH' }
  | { type: 'MATCH_SUCCESS' }
  | { type: 'MATCH_FAILURE'; payload: { message: string; mitzvah: Mitzvah } }
  | { type: 'CLEAR_SELECTED' }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'UPDATE_TIMER'; payload: { elapsedTime: number } }
  | { type: 'RESET_GAME' };

// Score calculation result
export interface ScoreResult {
  basePoints: number;        // 10 for correct match
  comboBonus: number;        // 5 or 10 for streaks
  totalPoints: number;       // basePoints + comboBonus
  newCombo: number;          // Updated combo count
}

// Level completion data
export interface LevelResult {
  level: number;
  score: number;
  moves: number;
  accuracy: number;          // matchedPairs / moves
  timeElapsed?: number;      // Optional timer feature
  passed: boolean;           // accuracy >= 70%
}
