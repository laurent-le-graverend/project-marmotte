import React from 'react';

/**
 * Reusable game setup component
 * @param {Object} props
 * @param {string} props.title - Setup screen title
 * @param {React.ReactNode} props.children - Game-specific setup options
 * @param {Function} props.onStartGame - Callback when starting game
 * @param {boolean} props.canStart - Whether the start button should be enabled
 * @returns {JSX.Element}
 */
const GameSetup = ({ title, children, onStartGame, canStart = true }) => {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <section className="flex flex-1 flex-col items-center rounded-xl border border-white/20 bg-white/95 p-4 shadow-md backdrop-blur-sm md:p-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-blue-700">{title}</h2>

          <div className="w-full space-y-6">{children}</div>

          <button
            onClick={onStartGame}
            disabled={!canStart}
            className="mt-6 w-full rounded-lg bg-green-500 py-3 text-lg font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Commencer la partie
          </button>
        </section>
      </div>
    </main>
  );
};

export default GameSetup;
