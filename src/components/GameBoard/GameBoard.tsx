import React from 'react';
import type { Card as CardType } from '../../types';
import Card from '../Card/Card';
import ScoreBoard from '../ScoreBoard/ScoreBoard';

interface GameBoardProps {
  cards: CardType[];
  score: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  combo: number;
  elapsedTime: number;
  onCardClick: (cardId: string) => void;
  disabled?: boolean;
}

export function GameBoard({
  cards,
  score,
  moves,
  matchedPairs,
  totalPairs,
  combo,
  elapsedTime,
  onCardClick,
  disabled = false,
}: GameBoardProps) {
  // Calculate grid columns based on card count
  const cardCount = cards.length;
  let gridCols = 'grid-cols-3 md:grid-cols-4';
  
  if (cardCount <= 8) {
    gridCols = 'grid-cols-2 md:grid-cols-4';
  } else if (cardCount <= 12) {
    gridCols = 'grid-cols-3 md:grid-cols-4';
  } else if (cardCount <= 16) {
    gridCols = 'grid-cols-4 md:grid-cols-4';
  } else if (cardCount <= 20) {
    gridCols = 'grid-cols-4 md:grid-cols-5';
  } else {
    gridCols = 'grid-cols-4 md:grid-cols-6';
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Score Board */}
      <ScoreBoard
        score={score}
        moves={moves}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        combo={combo}
        elapsedTime={elapsedTime}
      />

      {/* Card Grid */}
      <div className={`grid ${gridCols} gap-3 md:gap-4`}>
        {cards.map((card) => (
          <Card
            key={card.card_id}
            card={card}
            onClick={onCardClick}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
