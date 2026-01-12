import { LEVEL_CONFIGS } from '../../data/levels';

interface LevelSelectProps {
  onSelectLevel: (level: number) => void;
}

export function LevelSelect({ onSelectLevel }: LevelSelectProps) {
  const levelEmojis = ['📖', '👥', '⏰', '🌍', '⚖️'];
  const levelColors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-orange-400 to-orange-600',
    'from-red-400 to-red-600',
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Choose Your Level
          </h2>
          <p className="text-gray-600 text-lg">
            Match mitzvah cards to learn and test your knowledge!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {LEVEL_CONFIGS.map((config, index) => (
            <button
              key={config.level}
              onClick={() => onSelectLevel(config.level)}
              className={`
                relative overflow-hidden rounded-2xl p-6 text-left text-white
                bg-gradient-to-br ${levelColors[index]}
                shadow-lg hover:shadow-xl transition-all duration-300
                hover:scale-105 active:scale-95
                group
              `}
            >
              <div className="absolute top-4 right-4 text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
                {levelEmojis[index]}
              </div>
              
              <div className="relative z-10">
                <div className="text-sm font-semibold opacity-80 mb-1">
                  Level {config.level}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {config.name}
                </h3>
                <p className="text-sm opacity-90 mb-3">
                  {config.description}
                </p>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <span className="bg-white/20 px-2 py-1 rounded">
                    {config.min_cards}-{config.max_cards} cards
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-md p-6 max-w-md">
            <h4 className="font-semibold text-gray-800 mb-2">How to Play</h4>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>🎴 Click cards to flip them over</li>
              <li>🔍 Find matching pairs of mitzvah attributes</li>
              <li>⭐ Build combos for bonus points!</li>
              <li>📚 Learn from feedback when you miss</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelSelect;
