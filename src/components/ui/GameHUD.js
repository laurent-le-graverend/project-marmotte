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
      <div className="mb-6 flex w-full items-center justify-between">
        <h2 className="text-center text-xl font-bold text-blue-700  text-center block">
          {totalQuestions ? (
            <span>
              Question {currentQuestion} / {totalQuestions}
            </span>
          ) : (
            <span>Question {currentQuestion} (Jeu libre)</span>
          )}
        </h2>
        <button
          onClick={onQuit}
          className="ml-auto rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
        >
          Quitter
        </button>
      </div>

      <div className="flex w-full flex-col gap-2 text-lg text-gray-700 text-center">
        <div className="flex  flex-row gap-2 text-lg text-gray-700 font-bold text-xl justify-around">
          <div className="w-16 text-center">{formatTime(elapsedTime)}</div>
          <div className="w-16 text-center text-emerald-700">✓ {correctAnswers} </div>
          <div className="w-16 text-center text-rose-700">✗ {incorrectAnswers}</div>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </aside>
  );
};

export default GameHUD;
