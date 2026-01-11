import React, { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { GameState, GameAction, Card, Mitzvah } from '../types';

// Initial state
const initialState: GameState = {
  currentLevel: null,
  cards: [],
  selectedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  score: 0,
  combo: 0,
  moves: 0,
  startTime: null,
  elapsedTime: 0,
  gameStatus: 'idle',
  feedbackMessage: null,
  feedbackMitzvah: null,
};

/**
 * Game reducer - handles all game state transitions
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { level, cards, totalPairs } = action.payload;
      return {
        ...initialState,
        currentLevel: level,
        cards,
        totalPairs,
        startTime: Date.now(),
        elapsedTime: 0,
        gameStatus: 'playing',
      };
    }

    case 'SELECT_CARD': {
      const { cardId } = action.payload;
      
      // Can't select if checking, complete, or already have 2 selected
      if (state.gameStatus === 'checking' || state.gameStatus === 'complete') {
        return state;
      }
      if (state.selectedCards.length >= 2) {
        return state;
      }

      // Find the card
      const card = state.cards.find(c => c.card_id === cardId);
      if (!card || card.is_selected || card.is_matched) {
        return state;
      }

      // Select the card
      const newCards = state.cards.map(c =>
        c.card_id === cardId ? { ...c, is_selected: true } : c
      );
      
      const selectedCard = { ...card, is_selected: true };
      const newSelectedCards = [...state.selectedCards, selectedCard];

      // If we now have 2 selected cards, set status to checking
      const newStatus = newSelectedCards.length === 2 ? 'checking' : 'playing';

      return {
        ...state,
        cards: newCards,
        selectedCards: newSelectedCards,
        gameStatus: newStatus,
      };
    }

    case 'CHECK_MATCH': {
      // This action is handled externally - just a trigger
      return state;
    }

    case 'MATCH_SUCCESS': {
      const [card1, card2] = state.selectedCards;
      if (!card1 || !card2) return state;

      // Mark cards as matched and deselect them
      const newCards = state.cards.map(c => {
        if (c.card_id === card1.card_id || c.card_id === card2.card_id) {
          return { ...c, is_matched: true, is_selected: false };
        }
        return c;
      });

      // Calculate new score
      const newCombo = state.combo + 1;
      let comboBonus = 0;
      if (newCombo === 2) comboBonus = 5;
      else if (newCombo >= 3) comboBonus = 10;
      const newScore = state.score + 10 + comboBonus;

      const newMatchedPairs = state.matchedPairs + 1;
      const isComplete = newMatchedPairs === state.totalPairs;

      return {
        ...state,
        cards: newCards,
        selectedCards: [],
        matchedPairs: newMatchedPairs,
        score: newScore,
        combo: newCombo,
        moves: state.moves + 1,
        gameStatus: isComplete ? 'complete' : 'playing',
      };
    }

    case 'MATCH_FAILURE': {
      const { message, mitzvah } = action.payload;
      return {
        ...state,
        feedbackMessage: message,
        feedbackMitzvah: mitzvah,
        combo: 0, // Reset combo on miss
        moves: state.moves + 1,
        // Keep gameStatus as 'checking' until feedback is cleared
      };
    }

    case 'CLEAR_SELECTED': {
      const [card1, card2] = state.selectedCards;
      
      // Deselect cards
      const newCards = state.cards.map(c => {
        if (card1 && c.card_id === card1.card_id) return { ...c, is_selected: false };
        if (card2 && c.card_id === card2.card_id) return { ...c, is_selected: false };
        return c;
      });

      return {
        ...state,
        cards: newCards,
        selectedCards: [],
        gameStatus: 'playing',
      };
    }

    case 'CLEAR_FEEDBACK': {
      return {
        ...state,
        feedbackMessage: null,
        feedbackMitzvah: null,
      };
    }

    case 'UPDATE_TIMER': {
      const { elapsedTime } = action.payload;
      return {
        ...state,
        elapsedTime,
      };
    }

    case 'RESET_GAME': {
      return initialState;
    }

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to access game context
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export { gameReducer, initialState };
export default GameContext;
