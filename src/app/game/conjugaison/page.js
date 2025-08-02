'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import GameConjugaison from '@/components/game/GameConjugaison';
import Footer from '@/components/ui/Footer';
import Header from '@/components/ui/Header';
import { getPlayerName } from '@/lib/storage';

export default function GamePage() {
	const router = useRouter();

	useEffect(() => {
		const storedName = getPlayerName();
		if (!storedName) router.push('/');
	}, []);

	return (
		<main className="flex min-h-screen flex-col justify-between">
			<Header title="Jeu de Conjugaison" />
			<GameConjugaison />
			<Footer />
		</main>
	);
}
