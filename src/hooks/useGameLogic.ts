import { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { generateCardsForLevel } from '../utils/cardGenerator';
import { generateFeedbackMessage } from '../utils/feedback';
import { getLevelConfig } from '../data/levels';
import type { Mitzvah, Card, LevelConfig, ScoreResult } from '../types';
import mitzvosData from '../data/mitzvos.json';

// Type the imported JSON
const mitzvos: Mitzvah[] = mitzvosData as Mitzvah[];

/**
 * Validate if two cards form a match
 */
export function validateMatch(card1: Card, card2: Card, levelConfig: LevelConfig): boolean {
  // Cards must share the same mitzvah_id
  if (card1.mitzvah_id !== card2.mitzvah_id) {
    return false;
  }
  
  // Cards must be of different types (one type A, one type B)
  const hasTypeA = card1.card_type === levelConfig.card_type_a || card2.card_type === levelConfig.card_type_a;
  const hasTypeB = card1.card_type === levelConfig.card_type_b || card2.card_type === levelConfig.card_type_b;
  
  return hasTypeA && hasTypeB;
}

/**
 * Calculate score for a match attempt
 */
export function calculateScore(currentCombo: number, isMatch: boolean): ScoreResult {
  if (!isMatch) {
    return {
      basePoints: 0,
      comboBonus: 0,
      totalPoints: 0,
      newCombo: 0,
    };
  }

  const basePoints = 10;
  const newCombo = currentCombo + 1;
  
  let comboBonus = 0;
  if (newCombo === 2) comboBonus = 5;
  else if (newCombo >= 3) comboBonus = 10;

  return {
    basePoints,
    comboBonus,
    totalPoints: basePoints + comboBonus,
    newCombo,
  };
}

/**
 * Check if level is complete
 */
export function checkLevelComplete(matchedPairs: number, totalPairs: number): boolean {
  return matchedPairs === totalPairs;
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(matchedPairs: number, moves: number): number {
  if (moves === 0) return 0;
  return Math.round((matchedPairs / moves) * 100);
}

/**
 * Hook for game logic - connects components to GameContext
 */
export function useGameLogic() {
  const { state, dispatch } = useGame();

  // Start a new game at the specified level
  const startGame = useCallback((level: number) => {
    const levelConfig = getLevelConfig(level);
    if (!levelConfig) {
      console.error(`Invalid level: ${level}`);
      return;
    }

    const cards = generateCardsForLevel(mitzvos, levelConfig);
    const totalPairs = cards.length / 2;

    dispatch({
      type: 'START_GAME',
      payload: { level, cards, totalPairs },
    });
  }, [dispatch]);

  // Handle card click
  const selectCard = useCallback((cardId: string) => {
    dispatch({
      type: 'SELECT_CARD',
      payload: { cardId },
    });
  }, [dispatch]);

  // Timer effect - update elapsed time every second while playing
  useEffect(() => {
    if (state.gameStatus !== 'playing' && state.gameStatus !== 'checking') {
      return;
    }

    if (!state.startTime) {
      return;
    }

    const intervalId = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - state.startTime!) / 1000);
      dispatch({
        type: 'UPDATE_TIMER',
        payload: { elapsedTime },
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.gameStatus, state.startTime, dispatch]);

  // Check for match when two cards are selected
  useEffect(() => {
    if (state.gameStatus !== 'checking' || state.selectedCards.length !== 2) {
      return;
    }

    const [card1, card2] = state.selectedCards;
    const levelConfig = getLevelConfig(state.currentLevel!);
    
    if (!levelConfig) return;

    const isMatch = validateMatch(card1, card2, levelConfig);

    // Small delay to let player see the selection
    const timeoutId = setTimeout(() => {
      if (isMatch) {
        dispatch({ type: 'MATCH_SUCCESS' });
      } else {
        // Find the mitzvah for feedback
        const mitzvah = mitzvos.find(m => m.mitzvah_id === card1.mitzvah_id);
        const message = mitzvah 
          ? generateFeedbackMessage(mitzvah, levelConfig)
          : 'Try again!';
        
        dispatch({
          type: 'MATCH_FAILURE',
          payload: { message, mitzvah: mitzvah || card1 as unknown as Mitzvah },
        });
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [state.gameStatus, state.selectedCards, state.currentLevel, dispatch]);

  // Clear feedback and deselect cards
  const clearFeedback = useCallback(() => {
    dispatch({ type: 'CLEAR_FEEDBACK' });
    dispatch({ type: 'CLEAR_SELECTED' });
  }, [dispatch]);

  // Reset the game
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  // Calculate current accuracy
  const accuracy = calculateAccuracy(state.matchedPairs, state.moves);

  return {
    // State
    ...state,
    accuracy,
    
    // Actions
    startGame,
    selectCard,
    clearFeedback,
    resetGame,
  };
}

export default useGameLogic;
