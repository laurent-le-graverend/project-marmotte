import React from 'react';

/**
 * Reusable Game HUD (Heads-Up Display) component for displaying common game statistics
 * @param {Object} props
 * @param {number} props.elapsedTime - Time elapsed in seconds
 * @param {Function} props.formatTime - Function to format time display
 * @param {number} props.correctAnswers - Number of correct answers
 * @param {number} props.incorrectAnswers - Number of incorrect answers
 * @param {React.ReactNode} props.children - Game-specific controls to render below stats
 * @returns {JSX.Element}
 */
const GameHUD = ({ elapsedTime, formatTime, correctAnswers, incorrectAnswers, children }) => {
  return (
    <aside className="flex flex-1 flex-col items-center rounded-xl border border-white/20 bg-white/95 p-6 shadow-md backdrop-blur-sm">
      <h2 className="mb-4 text-center text-xl font-bold text-blue-700">Partie en cours</h2>
      <div className="flex w-full flex-col gap-2 text-lg text-gray-700">
        <div>
          <span className="font-bold">Temps passé :</span> {formatTime(elapsedTime)}
        </div>
        <div>
          <span className="font-bold text-green-600">Réponses correctes :</span> {correctAnswers}
        </div>
        <div>
          <span className="font-bold text-red-500">Réponses incorrectes :</span> {incorrectAnswers}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </aside>
  );
};

export default GameHUD;
