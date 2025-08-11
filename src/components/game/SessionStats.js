import React from 'react';

/**
 * Session statistics summary component
 * @param {Object} props
 * @param {number} props.totalQuestions - Total questions answered
 * @param {number} props.correctAnswers - Number of correct answers
 * @param {number} props.incorrectAnswers - Number of incorrect answers
 * @param {number} props.totalTime - Total session time in seconds
 * @param {Function} props.onPlayAgain - Callback for play again
 * @param {Function} props.onBackToMenu - Callback for back to menu
 * @param {Object} props.breakdown - Optional breakdown of specific stats (e.g., operators for math)
 * @returns {JSX.Element}
 */
const SessionStats = ({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  totalTime,
  onPlayAgain,
  onBackToMenu,
  breakdown = null,
}) => {
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <section className="flex flex-1 flex-col items-center rounded-xl border border-white/20 bg-white/95 p-4 shadow-md backdrop-blur-sm md:p-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-blue-700">🎉 Partie terminée ! 🎉</h2>

          <div className="w-full space-y-4 text-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Questions répondues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Précision</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-green-600">Réponses correctes :</span>
                <span>{correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-red-500">Réponses incorrectes :</span>
                <span>{incorrectAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Temps total :</span>
                <span>{formatTime(totalTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Temps moyen par question :</span>
                <span>{avgTimePerQuestion}s</span>
              </div>
            </div>

            {breakdown && (
              <div className="border-t pt-4">
                <h3 className="mb-2 font-bold text-gray-700">Détails :</h3>
                {Object.entries(breakdown).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between"
                  >
                    <span>{key} :</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 rounded-lg bg-blue-500 py-3 text-lg font-bold text-white transition hover:bg-blue-600"
            >
              Rejouer
            </button>
            <button
              onClick={onBackToMenu}
              className="flex-1 rounded-lg bg-gray-500 py-3 text-lg font-bold text-white transition hover:bg-gray-600"
            >
              Menu principal
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SessionStats;
