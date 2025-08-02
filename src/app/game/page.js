'use client';

import Link from 'next/link';

const GamePage = () => (
	<main className="flex min-h-screen flex-col items-center justify-center bg-blue-50">
		<section className="flex w-full max-w-md flex-col items-center gap-8 rounded-xl bg-white p-8 shadow-lg">
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
);

export default GamePage;
