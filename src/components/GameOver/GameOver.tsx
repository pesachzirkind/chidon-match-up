import Button from '../Button/Button';
import { calculateAccuracy } from '../../hooks/useGameLogic';

interface GameOverProps {
  score: number;
  moves: number;
  matchedPairs: number;
  currentLevel: number;
  elapsedTime: number;
  onPlayAgain: () => void;
  onSelectLevel: () => void;
  onNextLevel?: () => void;
}

/**
 * Format seconds into MM:SS display
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function GameOver({
  score,
  moves,
  matchedPairs,
  currentLevel,
  elapsedTime,
  onPlayAgain,
  onSelectLevel,
  onNextLevel,
}: GameOverProps) {
  const accuracy = calculateAccuracy(matchedPairs, moves);
  const passed = accuracy >= 70;
  const hasNextLevel = currentLevel < 5;

  // Determine rating based on accuracy and time
  let rating = '⭐';
  let ratingText = 'Good effort!';
  
  if (accuracy >= 90) {
    rating = '⭐⭐⭐';
    ratingText = 'Outstanding!';
  } else if (accuracy >= 80) {
    rating = '⭐⭐';
    ratingText = 'Great job!';
  } else if (accuracy >= 70) {
    rating = '⭐';
    ratingText = 'Well done!';
  } else {
    rating = '';
    ratingText = 'Keep practicing!';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in">
        {/* Confetti or celebration emoji */}
        <div className="text-center mb-4">
          <span className="text-6xl">
            {passed ? '🎉' : '📚'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          {passed ? 'Level Complete!' : 'Level Finished'}
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          {ratingText}
        </p>

        {/* Rating Stars */}
        {rating && (
          <div className="text-center text-4xl mb-6">
            {rating}
          </div>
        )}

        {/* Stats */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-xl md:text-2xl font-bold text-gray-700 font-mono">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-xs text-gray-500 uppercase">Time</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-xs text-gray-500 uppercase">Score</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-purple-600">{moves}</div>
              <div className="text-xs text-gray-500 uppercase">Moves</div>
            </div>
            <div>
              <div className={`text-xl md:text-2xl font-bold ${accuracy >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                {accuracy}%
              </div>
              <div className="text-xs text-gray-500 uppercase">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Pass/Fail Message */}
        <div className={`text-center p-3 rounded-lg mb-6 ${
          passed ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          {passed ? (
            <p>🎊 You passed! Great job learning the mitzvos!</p>
          ) : (
            <p>💪 Keep practicing to reach 70% accuracy!</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {passed && hasNextLevel && onNextLevel && (
            <Button
              variant="success"
              size="lg"
              onClick={onNextLevel}
              className="w-full"
            >
              Next Level →
            </Button>
          )}
          
          <Button
            variant="primary"
            size="md"
            onClick={onPlayAgain}
            className="w-full"
          >
            Play Again
          </Button>
          
          <Button
            variant="secondary"
            size="md"
            onClick={onSelectLevel}
            className="w-full"
          >
            Choose Another Level
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default GameOver;
