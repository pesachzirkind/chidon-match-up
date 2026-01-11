import React from 'react';
import type { Card as CardType, CardType as CardTypeEnum } from '../../types';
import { getCardTypeLabel } from '../../utils/feedback';
import './Card.css';

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

export function Card({ card, onClick, disabled = false }: CardProps) {
  const { card_id, card_type, display_text, is_selected, is_matched } = card;

  // Hide matched cards completely
  if (is_matched) {
    return (
      <div className="card-container aspect-[3/4]">
        <div className="card matched-hidden" />
      </div>
    );
  }

  const handleClick = () => {
    if (!disabled && !is_selected && !is_matched) {
      onClick(card_id);
    }
  };

  const isHebrew = card_type === 'hebrew_name';
  const cardClasses = [
    'card',
    'visible',
    is_selected ? 'selected' : '',
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'card-content',
    isHebrew ? 'hebrew' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="card-container aspect-[3/4]">
      <div
        className={cardClasses}
        onClick={handleClick}
        role="button"
        tabIndex={disabled || is_selected ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        aria-label={display_text}
      >
        {/* Card content - always visible */}
        <div className={contentClasses}>
          <span className="card-type-badge">
            {getCardTypeLabel(card_type)}
          </span>
          <span className="text-sm md:text-base lg:text-lg font-medium leading-tight px-2">
            {display_text}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
