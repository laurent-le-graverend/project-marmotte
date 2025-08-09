'use client';

import Link from 'next/link';

import PageLayout from '@/components/ui/PageLayout';

const GamePage = () => (
  <PageLayout>
    <main className="flex min-h-screen flex-col items-center justify-center">
      <section className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl border border-white/20 bg-white/95 p-8 shadow-lg backdrop-blur-sm">
        <div className="group inline-block cursor-pointer text-5xl">
          <span className="inline-block group-hover:animate-[roll_0.8s_linear_infinite]">🎲</span>
        </div>
        <h1 className="text-center text-2xl font-bold text-blue-700">Choisis ton jeu</h1>
        <div className="flex w-full flex-col gap-4">
          <Link
            href="/game/conjugaison"
            className="w-full rounded-lg bg-blue-500 py-4 text-center text-lg font-bold text-white transition hover:bg-blue-600"
          >
            Conjugaison
          </Link>
          <Link
            href="/game/maths"
            className="w-full rounded-lg bg-green-500 py-4 text-center text-lg font-bold text-white transition hover:bg-green-600"
          >
            Mathématiques
          </Link>
        </div>
      </section>
    </main>
  </PageLayout>
);

export default GamePage;
