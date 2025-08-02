import React, { useEffect, useRef, useState } from 'react';

import { getPlayerName, getScore, setScore } from '../../lib/storage';

const data = {
	être: {
		présent: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
		imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
		futur: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
		'passé composé': ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
	},
	avoir: {
		présent: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
		imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
		futur: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
		'passé composé': ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu'],
	},
	aller: {
		présent: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
		imparfait: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
		futur: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
		'passé composé': ['suis allé', 'es allé', 'est allé', 'sommes allés', 'êtes allés', 'sont allés'],
	},
	faire: {
		présent: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
		imparfait: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
		futur: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
		'passé composé': ['ai fait', 'as fait', 'a fait', 'avons fait', 'avez fait', 'ont fait'],
	},
	dire: {
		présent: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
		imparfait: ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient'],
		futur: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
		'passé composé': ['ai dit', 'as dit', 'a dit', 'avons dit', 'avez dit', 'ont dit'],
	},
	voir: {
		présent: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
		imparfait: ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient'],
		futur: ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
		'passé composé': ['ai vu', 'as vu', 'a vu', 'avons vu', 'avez vu', 'ont vu'],
	},
	prendre: {
		présent: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
		imparfait: ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
		futur: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
		'passé composé': ['ai pris', 'as pris', 'a pris', 'avons pris', 'avez pris', 'ont pris'],
	},
	aimer: {
		présent: ['aime', 'aimes', 'aime', 'aimons', 'aimez', 'aiment'],
		imparfait: ['aimais', 'aimais', 'aimait', 'aimions', 'aimiez', 'aimaient'],
		futur: ['aimerai', 'aimeras', 'aimera', 'aimerons', 'aimerez', 'aimeront'],
		'passé composé': ['ai aimé', 'as aimé', 'a aimé', 'avons aimé', 'avez aimé', 'ont aimé'],
	},
};

const pronoms = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomQuestion = (mode) => {
	const verbs = mode === 'simple' ? ['être', 'avoir'] : Object.keys(data);
	const verb = randomFrom(verbs);
	const temps = randomFrom(Object.keys(data[verb]));
	const index = Math.floor(Math.random() * 6);
	const sujet = pronoms[index];
	const expected = data[verb][temps][index];
	return { sujet, verbe: verb, temps, solution: expected };
};

const GameConjugaison = () => {
	const [mode, setMode] = useState('simple');
	const [question, setQuestion] = useState(null);
	const [answer, setAnswer] = useState('');
	const [feedback, setFeedback] = useState('');
	const [currentScore, setCurrentScore] = useState(() => getScore());
	const [isChecking, setIsChecking] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const timerRef = useRef(null);

	const [totalQuestions, setTotalQuestions] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [incorrectAnswers, setIncorrectAnswers] = useState(0);

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	useEffect(() => {
		setQuestion(getRandomQuestion(mode));
	}, [mode]);

	useEffect(() => {
		setElapsedTime(0);
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			setElapsedTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, [question]);

	const removeSubject = (input) => {
		const pronouns = ['je', "j'", 'tu', 'il', 'elle', 'il/elle', 'nous', 'vous', 'ils', 'elles', 'ils/elles'];
		let result = input.trim().toLowerCase();
		for (const pronoun of pronouns) {
			if ((pronoun.endsWith("'") && result.startsWith(pronoun)) || result.startsWith(pronoun + ' ')) {
				result = result.slice(pronoun.length).trim();
				break;
			}
		}
		return result;
	};

	const checkAnswer = (e) => {
		e.preventDefault();
		if (!question || isChecking) return;

		setIsChecking(true);
		setTotalQuestions((prev) => prev + 1);

		const userAnswer = removeSubject(answer.trim().toLowerCase());
		const correctAnswer = question.solution.toLowerCase();

		if (userAnswer === correctAnswer) {
			setFeedback('🎉 Bravo ! 🎉');
			setCorrectAnswers((prev) => prev + 1);
			const newScore = currentScore + 1;
			setCurrentScore(newScore);
			setScore(newScore);
		} else {
			setFeedback(`❌ Oups ! La bonne réponse est : ${question.solution}`);
			setIncorrectAnswers((prev) => prev + 1);
		}

		setTimeout(() => {
			setQuestion(getRandomQuestion(mode));
			setAnswer('');
			setFeedback('');
			setIsChecking(false);
		}, 2500);
	};

	if (!question) return <div className="flex h-96 items-center justify-center">Chargement…</div>;

	return (
		<main className="flex min-h-[70vh] flex-col items-center justify-center">
			<div className="flex w-full max-w-lg flex-col gap-6">
				<aside className="flex flex-1 flex-col items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
					<h2 className="mb-4 text-center text-xl font-bold text-blue-700">Jeu en cours</h2>
					<div className="flex w-full flex-col gap-2 text-lg text-gray-700">
						<div>
							<span className="font-bold">Temps passé :</span> {formatTime(elapsedTime)}
						</div>
						<div>
							<span className="font-bold text-green-600">Réponses correctes :</span> {correctAnswers}
						</div>
						<div>
							<span className="font-bold text-red-500">Réponses incorrectes :</span> {incorrectAnswers}
						</div>
					</div>
					<div className="mt-4 flex gap-2">
						<button
							className={`rounded-lg px-4 py-2 font-bold ${mode === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'}`}
							onClick={() => setMode('simple')}
							disabled={mode === 'simple'}
						>
							Simple
						</button>
						<button
							className={`rounded-lg px-4 py-2 font-bold ${mode === 'advanced' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'}`}
							onClick={() => setMode('advanced')}
							disabled={mode === 'advanced'}
						>
							Avancé
						</button>
					</div>
				</aside>
				<section className="flex flex-1 flex-col items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
					<h2 className="mb-4 text-center text-xl font-bold text-blue-700">Question {totalQuestions + 1}</h2>
					<h2 className="mb-4 text-center text-lg font-bold text-gray-800">
						Conjugue <span className="font-extrabold text-blue-600">&quot;{question.verbe}&quot;</span> <br />
						au temps <span className="font-extrabold text-green-600">&quot;{question.temps}&quot;</span> <br />
						pour le sujet <span className="font-extrabold text-pink-600">&quot;{question.sujet}&quot;</span>
					</h2>
					<form
						onSubmit={checkAnswer}
						className="flex w-full flex-col items-center gap-4"
					>
						<input
							type="text"
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							disabled={isChecking}
							autoFocus
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							inputMode="text"
							className="w-full rounded-lg border-2 border-blue-300 p-3 text-center text-lg transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
							placeholder="Ta réponse ici"
						/>
						<button
							type="submit"
							disabled={isChecking || answer.trim() === ''}
							className="w-full rounded-lg bg-blue-500 py-3 text-lg font-bold text-white transition hover:bg-blue-600"
						>
							Valider
						</button>
					</form>
					<p className="mt-2 text-center text-xl font-semibold">{feedback}&nbsp;</p>
				</section>
			</div>
		</main>
	);
};

export default GameConjugaison;
