'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import PageLayout from '@/components/ui/PageLayout';

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
    <PageLayout>
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-sm md:p-8">
          <div className="mb-2 flex items-center gap-2">
            <Image
              src="/images/beaver-thumb-up.png"
              alt="Beaver mascot giving thumbs up"
              width={128}
              height={135}
              priority
            />
          </div>
          <h1 className="mb-2 text-center text-3xl font-extrabold text-blue-600">
            Saura du résoudre les jeux du castor malin ?
          </h1>
          <p className="text-center text-lg leading-snug text-gray-700">
            Entre ton prénom pour commencer à jouer&nbsp;:
          </p>
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
    </PageLayout>
  );
};

export default HomePage;
