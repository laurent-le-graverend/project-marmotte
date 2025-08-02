'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { getScores } from '@/lib/storage';

const LeaderboardPage = () => {
  const [scores, setScores] = useState({});
  const router = useRouter();

  useEffect(() => {
    setScores(getScores());
  }, []);

  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-pink-600">🏆 Leaderboard</h1>
        {sortedScores.length === 0 ? (
          <p className="text-center text-lg text-gray-500">Aucun score pour l&apos;instant.</p>
        ) : (
          <ol className="space-y-3">
            {sortedScores.map(([name, score], idx) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-lg font-semibold"
              >
                <span>
                  {idx + 1}. {name}
                </span>
                <span className="text-blue-600">{score} pts</span>
              </li>
            ))}
          </ol>
        )}
        <button
          onClick={() => router.push('/')}
          className="mt-8 w-full rounded-lg bg-blue-500 py-3 text-lg font-bold text-white transition hover:bg-blue-600"
        >
          Retour à l&apos;accueil
        </button>
      </section>
    </main>
  );
};

export default LeaderboardPage;
