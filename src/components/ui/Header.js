import { useEffect, useState } from 'react';

import { getPlayerName, getScore } from '@/lib/storage';

const Header = ({ title }) => {
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const updateState = () => {
      setCurrentPlayerName(getPlayerName() || '');
      setCurrentScore(getScore() || 0);
    };

    updateState();

    const intervalId = setInterval(updateState, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="flex w-full flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-pink-400 py-6 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🎉</span>
        <h1 className="text-3xl font-extrabold text-white drop-shadow">{title}</h1>
      </div>
      {currentPlayerName && (
        <span className="bg-opacity-60 mt-2 rounded-full bg-blue-500 px-4 py-1 text-lg font-semibold text-white">
          👋 {currentPlayerName} !
        </span>
      )}
      {typeof currentScore === 'number' && (
        <span className="mt-2 rounded-full bg-pink-500 px-4 py-1 text-lg font-semibold text-white">
          🏅 Total score: {currentScore}
        </span>
      )}
    </header>
  );
};

export default Header;
