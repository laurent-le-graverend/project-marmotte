'use client';

import Image from 'next/image';
import Link from 'next/link';

import PageLayout from '@/components/ui/PageLayout';

const GamePage = () => (
  <PageLayout>
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <section className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:p-8">
        <div className="mb-2 flex items-center gap-2">
          <Image
            src="/images/beaver-waiting.png"
            alt="Beaver mascot giving thumbs up"
            width={108}
            height={135}
            priority
          />
        </div>
        <h1 className="mb-2 text-center text-3xl font-extrabold text-blue-600">Choisis ton jeu :</h1>
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
