import React from 'react';

interface ScoreBoardProps {
  score: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  combo: number;
  elapsedTime: number;
}

/**
 * Format seconds into MM:SS display
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ScoreBoard({ score, moves, matchedPairs, totalPairs, combo, elapsedTime }: ScoreBoardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {/* Timer */}
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-gray-700 font-mono">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
            Time
          </div>
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-600">
            {score}
          </div>
          <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
            Score
          </div>
        </div>

        {/* Progress */}
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {matchedPairs}/{totalPairs}
          </div>
          <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
            Matches
          </div>
        </div>

        {/* Moves */}
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-purple-600">
            {moves}
          </div>
          <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
            Moves
          </div>
        </div>

        {/* Combo */}
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-orange-500">
            {combo > 0 ? (
              <span className="flex items-center justify-center gap-1">
                {combo}x
                {combo >= 3 && <span className="text-lg">🔥</span>}
              </span>
            ) : (
              '-'
            )}
          </div>
          <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
            Combo
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
