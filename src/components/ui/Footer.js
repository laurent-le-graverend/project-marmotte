'use client';

import { useRouter } from 'next/navigation';

const Footer = () => {
	const router = useRouter();

	return (
		<footer className="mt-8 flex w-full items-center justify-center gap-6 bg-gradient-to-r from-blue-200 to-pink-200 py-4 shadow-inner">
			<button
				onClick={() => router.push('/')}
				className="rounded-lg bg-blue-500 px-5 py-2 text-lg font-semibold text-white transition hover:bg-blue-600"
			>
				🏠 Retour à l'accueil
			</button>
			<button
				onClick={() => router.push('/game')}
				className="rounded-lg bg-blue-500 px-5 py-2 text-lg font-semibold text-white transition hover:bg-blue-600"
			>
				🎲 Autres jeux
			</button>
			<button
				onClick={() => router.push('/leaderboard')}
				className="rounded-lg bg-pink-500 px-5 py-2 text-lg font-semibold text-white transition hover:bg-pink-600"
			>
				🏆 Leaderboard
			</button>
		</footer>
	);
};

export default Footer;
