'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getScores, setPlayerName, setScore } from '../lib/storage';

const HomePage = () => {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      const scores = getScores();
      if (!(name.trim() in scores)) {
        setScore(0);
      } else {
        setScore(scores[name.trim()]);
      }
      router.push('/game');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      handleStart();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100">
      <section className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="group inline-block cursor-pointer">
            <span className="inline-block -scale-x-100 text-3xl group-hover:animate-[jump_0.6s_ease-in-out_infinite]">
              🦫
            </span>
          </span>
          <span className="mx-2 inline-block text-5xl">🎲</span>
          <span className="group inline-block cursor-pointer">
            <span className="inline-block text-3xl group-hover:animate-[jump_0.6s_ease-in-out_infinite]">🦫</span>
          </span>
        </div>
        <h1 className="mb-2 text-center text-3xl font-extrabold text-blue-600">
          Bievenue dans le jeux des castors malins !
        </h1>
        <p className="text-center text-lg leading-snug text-gray-700">Entre ton prénom pour commencer à jouer&nbsp;:</p>
        <input
          value={name}
          name="playerName"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ton prénom"
          className="w-full rounded-lg border-2 border-blue-300 px-4 py-3 text-center text-lg transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleStart}
          disabled={name.trim() === ''}
          className="w-full cursor-pointer rounded-lg bg-blue-500 py-3 text-xl font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          Commencer
        </button>
      </section>
    </main>
  );
};

export default HomePage;
