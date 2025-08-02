import React, { useEffect, useRef, useState } from 'react';

import { getScore, setScore } from '@/lib/storage';

const operationsList = [
	{ key: 'add', label: 'Addition', symbol: '+' },
	{ key: 'sub', label: 'Soustraction', symbol: '-' },
	{ key: 'mul', label: 'Multiplication', symbol: '×' },
	{ key: 'div', label: 'Division', symbol: '÷' },
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestion = (enabledOps, digits) => {
	const ops = operationsList.filter((op) => enabledOps[op.key]);
	if (ops.length === 0) return null;
	const op = ops[getRandomInt(0, ops.length - 1)];
	let a, b, question, answer;

	const min = digits === 'double' ? 10 : 1;
	const max = digits === 'double' ? 99 : 9;

	switch (op.key) {
		case 'add':
			a = getRandomInt(min, max);
			b = getRandomInt(min, max);
			question = `${a} + ${b}`;
			answer = a + b;
			break;
		case 'sub':
			a = getRandomInt(min, max);
			b = getRandomInt(min, a); // ensure non-negative
			question = `${a} - ${b}`;
			answer = a - b;
			break;
		case 'mul':
			a = getRandomInt(min, max);
			b = getRandomInt(min, max);
			question = `${a} × ${b}`;
			answer = a * b;
			break;
		case 'div':
			b = getRandomInt(min, max);
			answer = getRandomInt(min, max);
			a = b * answer;
			question = `${a} ÷ ${b}`;
			break;
		default:
			return null;
	}
	return { question, answer, op: op.label };
};

const GameMathematiques = () => {
	const [enabledOps, setEnabledOps] = useState({
		add: true,
		sub: true,
		mul: false,
		div: false,
	});
	const [digits, setDigits] = useState('single');
	const [question, setQuestion] = useState(null);
	const [userAnswer, setUserAnswer] = useState('');
	const [feedback, setFeedback] = useState('');
	const [isChecking, setIsChecking] = useState(false);
	const [currentScore, setCurrentScore] = useState(0);
	const [totalQuestions, setTotalQuestions] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [incorrectAnswers, setIncorrectAnswers] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const timerRef = useRef(null);

	useEffect(() => {
		setQuestion(generateQuestion(enabledOps, digits));
		setUserAnswer('');
		setFeedback('');
		setIsChecking(false);
		setTotalQuestions(0);
		setCorrectAnswers(0);
		setIncorrectAnswers(0);
		setCurrentScore(0);
	}, [enabledOps, digits]);

	useEffect(() => {
		setElapsedTime(0);
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			setElapsedTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, [question]);

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const handleToggleOp = (key) => {
		setEnabledOps((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleDigitsChange = (val) => setDigits(val);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!question || isChecking) return;
		setIsChecking(true);
		setTotalQuestions((q) => q + 1);

		const correct = Number(userAnswer) === question.answer;
		if (correct) {
			setFeedback('🎉 Bravo ! 🎉');
			setCorrectAnswers((c) => c + 1);
			setCurrentScore((s) => s + 1);
			setScore(getScore() + 1);
		} else {
			setFeedback(`❌ Oups ! La bonne réponse est : ${question.answer}`);
			setIncorrectAnswers((i) => i + 1);
		}

		setTimeout(() => {
			setQuestion(generateQuestion(enabledOps, digits));
			setUserAnswer('');
			setFeedback('');
			setIsChecking(false);
		}, 2500);
	};

	return (
		<main className="flex min-h-[70vh] flex-col items-center justify-center">
			<div className="flex w-full max-w-lg flex-col gap-6">
				<aside className="flex flex-1 flex-col items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
					<h2 className="mb-4 text-center text-xl font-bold text-blue-700">Jeu Mathématiques</h2>
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
					<div className="mt-4 flex flex-wrap justify-center gap-2">
						{operationsList.map((op) => (
							<button
								key={op.key}
								className={`rounded-lg border-2 px-4 py-1 text-2xl font-bold transition ${
									enabledOps[op.key]
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-blue-300 bg-gray-100 text-blue-700'
								}`}
								onClick={() => handleToggleOp(op.key)}
								type="button"
							>
								{op.symbol}
							</button>
						))}
					</div>
					<div className="mt-4 flex justify-center gap-2">
						<button
							className={`rounded-lg px-4 py-2 font-bold ${
								digits === 'single' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
							}`}
							onClick={() => handleDigitsChange('single')}
							disabled={digits === 'single'}
							type="button"
						>
							Chiffres simples
						</button>
						<button
							className={`rounded-lg px-4 py-2 font-bold ${
								digits === 'double' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
							}`}
							onClick={() => handleDigitsChange('double')}
							disabled={digits === 'double'}
							type="button"
						>
							Chiffres doubles
						</button>
					</div>
				</aside>
				{question && (
					<section className="flex flex-1 flex-col items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-center text-xl font-bold text-blue-700">Question {totalQuestions + 1}</h2>
						<h2 className="mb-4 text-center text-lg font-bold text-gray-800">
							Résous : <span className="font-extrabold text-blue-600">{question.question}</span>
						</h2>
						<form
							onSubmit={handleSubmit}
							className="flex w-full flex-col items-center gap-4"
						>
							<input
								type="number"
								value={userAnswer}
								onChange={(e) => setUserAnswer(e.target.value)}
								disabled={isChecking}
								autoFocus
								autoComplete="off"
								className="w-full rounded-lg border-2 border-blue-300 p-3 text-center text-lg transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
								placeholder="Ta réponse ici"
							/>
							<button
								type="submit"
								disabled={isChecking || userAnswer.trim() === ''}
								className="w-full rounded-lg bg-blue-500 py-3 text-lg font-bold text-white transition hover:bg-blue-600"
							>
								Valider
							</button>
						</form>
						<p className="mt-2 text-center text-xl font-semibold">{feedback}&nbsp;</p>
					</section>
				)}
			</div>
		</main>
	);
};

export default GameMathematiques;
