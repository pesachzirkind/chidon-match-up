import React from 'react';
import Button from '../Button/Button';

interface HeaderProps {
  onBackToMenu?: () => void;
  showBackButton?: boolean;
  levelName?: string;
}

export function Header({ onBackToMenu, showBackButton = false, levelName }: HeaderProps) {
  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBackToMenu && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onBackToMenu}
            >
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
              Mitzvah Match-Up
            </h1>
            {levelName && (
              <p className="text-sm text-gray-600 mt-1">{levelName}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-4xl">🕎</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
