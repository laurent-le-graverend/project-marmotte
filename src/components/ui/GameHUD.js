import React from 'react';

/**
 * Reusable Game HUD (Heads-Up Display) component for displaying common game statistics
 * @param {Object} props
 * @param {number} props.elapsedTime - Time elapsed in seconds
 * @param {Function} props.formatTime - Function to format time display
 * @param {number} props.correctAnswers - Number of correct answers
 * @param {number} props.incorrectAnswers - Number of incorrect answers
 * @param {number} props.currentQuestion - Current question number (1-based)
 * @param {number|null} props.totalQuestions - Total questions (null for free play)
 * @param {Function} props.onQuit - Callback when quit button is clicked
 * @param {React.ReactNode} props.children - Game-specific controls to render below stats
 * @returns {JSX.Element}
 */
const GameHUD = ({
  elapsedTime,
  formatTime,
  correctAnswers,
  incorrectAnswers,
  currentQuestion,
  totalQuestions,
  onQuit,
  children,
}) => {
  const progressPercentage = totalQuestions ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <aside className="flex flex-1 flex-col items-center rounded-xl border border-white/20 bg-white/95 p-6 shadow-md backdrop-blur-sm">
      <div className="mb-4 flex w-full items-center justify-between">
        <h2 className="text-center text-xl font-bold text-blue-700">Partie en cours</h2>
        <button
          onClick={onQuit}
          className="rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white transition hover:bg-red-600"
        >
          Quitter
        </button>
      </div>

      <div className="flex w-full flex-col gap-2 text-lg text-gray-700">
        <div>
          <span className="font-bold">Progress :</span>{' '}
          {totalQuestions ? (
            <span>
              {currentQuestion} / {totalQuestions}
            </span>
          ) : (
            <span>Jeu libre (Question {currentQuestion})</span>
          )}
        </div>

        {totalQuestions && (
          <div className="w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

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
