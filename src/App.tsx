import { GameProvider } from './context/GameContext';
import { useGameLogic } from './hooks/useGameLogic';
import { getLevelConfig } from './data/levels';
import Header from './components/Header/Header';
import LevelSelect from './components/LevelSelect/LevelSelect';
import GameBoard from './components/GameBoard/GameBoard';
import FeedbackModal from './components/Feedback/FeedbackModal';
import GameOver from './components/GameOver/GameOver';
import './index.css';

function GameApp() {
  const {
    currentLevel,
    cards,
    score,
    moves,
    matchedPairs,
    totalPairs,
    combo,
    elapsedTime,
    gameStatus,
    feedbackMessage,
    feedbackMitzvah,
    startGame,
    selectCard,
    clearFeedback,
    resetGame,
  } = useGameLogic();

  const levelConfig = currentLevel ? getLevelConfig(currentLevel) : null;
  const isPlaying = gameStatus === 'playing' || gameStatus === 'checking';
  const isComplete = gameStatus === 'complete';

  // Handle level selection
  const handleSelectLevel = (level: number) => {
    startGame(level);
  };

  // Handle going back to menu
  const handleBackToMenu = () => {
    resetGame();
  };

  // Handle playing again (same level)
  const handlePlayAgain = () => {
    if (currentLevel) {
      startGame(currentLevel);
    }
  };

  // Handle next level
  const handleNextLevel = () => {
    if (currentLevel && currentLevel < 5) {
      startGame(currentLevel + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header
        showBackButton={currentLevel !== null}
        onBackToMenu={handleBackToMenu}
        levelName={levelConfig?.name}
      />

      <main className="pb-8">
        {/* Level Selection Screen */}
        {gameStatus === 'idle' && (
          <LevelSelect onSelectLevel={handleSelectLevel} />
        )}

        {/* Game Board */}
        {(isPlaying || isComplete) && (
          <GameBoard
            cards={cards}
            score={score}
            moves={moves}
            matchedPairs={matchedPairs}
            totalPairs={totalPairs}
            combo={combo}
            elapsedTime={elapsedTime}
            onCardClick={selectCard}
            disabled={gameStatus === 'checking'}
          />
        )}

        {/* Feedback Modal - shown on wrong match */}
        {feedbackMessage && (
          <FeedbackModal
            message={feedbackMessage}
            mitzvah={feedbackMitzvah}
            onClose={clearFeedback}
          />
        )}

        {/* Game Over Screen */}
        {isComplete && (
          <GameOver
            score={score}
            moves={moves}
            matchedPairs={matchedPairs}
            currentLevel={currentLevel!}
            elapsedTime={elapsedTime}
            onPlayAgain={handlePlayAgain}
            onSelectLevel={handleBackToMenu}
            onNextLevel={currentLevel! < 5 ? handleNextLevel : undefined}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
