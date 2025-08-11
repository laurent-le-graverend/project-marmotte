'use client';

import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="mt-8 flex w-full flex-col items-center justify-center gap-3 border-t border-white/30 bg-white/80 py-4 shadow-inner backdrop-blur-md sm:flex-row sm:gap-6">
      <button
        onClick={() => router.push('/')}
        className="w-full rounded-lg bg-blue-500 px-5 py-2 text-lg font-semibold text-white transition hover:bg-blue-600 sm:w-auto"
      >
        🏠 Retour à l&apos;accueil
      </button>
      <button
        onClick={() => router.push('/game')}
        className="w-full rounded-lg bg-blue-500 px-5 py-2 text-lg font-semibold text-white transition hover:bg-blue-600 sm:w-auto"
      >
        🎲 Autres jeux
      </button>
      <button
        onClick={() => router.push('/leaderboard')}
        className="w-full rounded-lg bg-pink-500 px-5 py-2 text-lg font-semibold text-white transition hover:bg-pink-600 sm:w-auto"
      >
        🏆 Leaderboard
      </button>
    </footer>
  );
};

export default Footer;
