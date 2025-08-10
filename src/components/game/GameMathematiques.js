import React, { useEffect, useState } from 'react';

import GameSetup from '@/components/game/GameSetup';
import SessionStats from '@/components/game/SessionStats';
import GameHUD from '@/components/ui/GameHUD';
import useGameTimer from '@/hooks/useGameTimer';
import { getScore, setScore } from '@/lib/storage';

const operationsList = [
  { key: 'add', label: 'Addition', symbol: '+' },
  { key: 'sub', label: 'Soustraction', symbol: '-' },
  { key: 'mul', label: 'Multiplication', symbol: '×' },
  { key: 'div', label: 'Division', symbol: '÷' },
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestion = (enabledOps, digits) => {
  const ops = operationsList.filter((op) => enabledOps?.[op.key]);
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
      const divMin = digits === 'double' ? 2 : 1;
      const divMax = digits === 'double' ? 10 : 9;

      b = getRandomInt(divMin, divMax); // divisor
      answer = getRandomInt(divMin, divMax); // quotient
      a = b * answer; // dividend
      question = `${a} ÷ ${b}`;
      break;
    default:
      return null;
  }
  return { question, answer, op: op.label };
};

const GameMathematiques = () => {
  // Session state management
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'stats'
  const [sessionConfig, setSessionConfig] = useState({
    enabledOps: {
      add: true,
      sub: true,
      mul: false,
      div: false,
    },
    digits: 'single',
    totalQuestions: null, // null for free play
  });

  // Game state
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // Session tracking
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [operatorStats, setOperatorStats] = useState({});

  // Use the custom timer hook
  const { elapsedTime, formatTime } = useGameTimer(question);

  // Start a new game with the selected configuration
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(1);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setCurrentScore(0);
    setOperatorStats({});
    setSessionStartTime(Date.now());
    setQuestion(generateQuestion(sessionConfig.enabledOps, sessionConfig.digits));
  };

  // Quit the current session
  const quitSession = () => {
    setGameState('stats');
  };

  // Check if session should end (when total questions limit reached)
  useEffect(() => {
    if (gameState === 'playing' && sessionConfig.totalQuestions && currentQuestion > sessionConfig.totalQuestions) {
      setGameState('stats');
    }
  }, [currentQuestion, sessionConfig.totalQuestions, gameState]);

  const handleToggleOp = (key) => {
    setSessionConfig((prev) => {
      const newEnabledOps = { ...prev.enabledOps };
      const enabledCount = Object.values(newEnabledOps).filter(Boolean).length;
      if (newEnabledOps[key] && enabledCount === 1) {
        // Prevent disabling the last enabled operation
        return prev;
      }
      newEnabledOps[key] = !newEnabledOps[key];
      return { ...prev, enabledOps: newEnabledOps };
    });
  };

  const handleDigitsChange = (val) => {
    setSessionConfig((prev) => ({ ...prev, digits: val }));
  };

  const canStartGame = () => {
    return Object.values(sessionConfig.enabledOps).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || isChecking) return;
    setIsChecking(true);

    const correct = Number(userAnswer) === question.answer;

    // Update operator stats
    setOperatorStats((prev) => ({
      ...prev,
      [question.op]: {
        correct: (prev[question.op]?.correct || 0) + (correct ? 1 : 0),
        total: (prev[question.op]?.total || 0) + 1,
      },
    }));

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
      // Check if we've reached the question limit
      if (sessionConfig.totalQuestions && currentQuestion >= sessionConfig.totalQuestions) {
        setGameState('stats');
      } else {
        setQuestion(generateQuestion(sessionConfig.enabledOps, sessionConfig.digits));
        setCurrentQuestion((prev) => prev + 1);
        setUserAnswer('');
        setFeedback('');
        setIsChecking(false);
      }
    }, 2500);
  };

  // Reset to setup screen
  const resetToSetup = () => {
    setGameState('setup');
    setQuestion(null);
    setUserAnswer('');
    setFeedback('');
    setIsChecking(false);
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <GameSetup
        title="Configuration - Jeu de Mathématiques"
        onStartGame={startGame}
        canStart={canStartGame()}
      >
        <div>
          <h3 className="mb-3 font-bold text-gray-700">Opérations :</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {operationsList.map((op) => (
              <button
                key={op.key}
                className={`rounded-lg border-2 px-4 py-1 text-2xl font-bold transition ${
                  sessionConfig.enabledOps[op.key]
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
        </div>

        <div>
          <h3 className="mb-3 font-bold text-gray-700">Difficulté :</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 rounded-lg px-4 py-2 font-bold ${
                sessionConfig.digits === 'single' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => handleDigitsChange('single')}
              type="button"
            >
              Chiffres simples (1-9)
            </button>
            <button
              className={`flex-1 rounded-lg px-4 py-2 font-bold ${
                sessionConfig.digits === 'double' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => handleDigitsChange('double')}
              type="button"
            >
              Chiffres doubles (10-99)
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-bold text-gray-700">Nombre de questions :</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`rounded-lg px-4 py-2 font-bold ${
                sessionConfig.totalQuestions === null ? 'bg-green-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => setSessionConfig((prev) => ({ ...prev, totalQuestions: null }))}
            >
              Jeu libre
            </button>
            <button
              className={`rounded-lg px-4 py-2 font-bold ${
                sessionConfig.totalQuestions === 10 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => setSessionConfig((prev) => ({ ...prev, totalQuestions: 10 }))}
            >
              10 questions
            </button>
            <button
              className={`rounded-lg px-4 py-2 font-bold ${
                sessionConfig.totalQuestions === 20 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => setSessionConfig((prev) => ({ ...prev, totalQuestions: 20 }))}
            >
              20 questions
            </button>
            <button
              className={`rounded-lg px-4 py-2 font-bold ${
                sessionConfig.totalQuestions === 50 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => setSessionConfig((prev) => ({ ...prev, totalQuestions: 50 }))}
            >
              50 questions
            </button>
          </div>
        </div>
      </GameSetup>
    );
  }

  // Stats screen
  if (gameState === 'stats') {
    const totalSessionTime = Math.round((Date.now() - sessionStartTime) / 1000);
    const totalAnswered = correctAnswers + incorrectAnswers;

    // Build operator breakdown
    const operatorBreakdown = {};
    Object.entries(operatorStats).forEach(([op, stats]) => {
      const accuracy = Math.round((stats.correct / stats.total) * 100);
      operatorBreakdown[op] = `${stats.correct}/${stats.total} (${accuracy}%)`;
    });

    return (
      <SessionStats
        totalQuestions={totalAnswered}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        totalTime={totalSessionTime}
        onPlayAgain={resetToSetup}
        onBackToMenu={() => window.history.back()}
        breakdown={{
          Difficulté: sessionConfig.digits === 'single' ? 'Chiffres simples (1-9)' : 'Chiffres doubles (10-99)',
          'Type de session': sessionConfig.totalQuestions ? `${sessionConfig.totalQuestions} questions` : 'Jeu libre',
          ...operatorBreakdown,
        }}
      />
    );
  }

  // Playing screen
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center py-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <GameHUD
          elapsedTime={elapsedTime}
          formatTime={formatTime}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          currentQuestion={currentQuestion}
          totalQuestions={sessionConfig.totalQuestions}
          onQuit={quitSession}
        />
        {question && (
          <section className="flex flex-1 flex-col items-center rounded-xl border border-white/20 bg-white/95 p-6 shadow-md backdrop-blur-sm">
            <h2 className="mb-4 text-center text-xl font-bold text-blue-700">
              Question {currentQuestion}
              {sessionConfig.totalQuestions && ` / ${sessionConfig.totalQuestions}`}
            </h2>
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
                disabled={isChecking || feedback.length || userAnswer.trim() === ''}
                className="w-full rounded-lg bg-blue-500 py-3 text-lg font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Valider
              </button>
            </form>
            <p className="mt-4 text-center text-xl font-semibold">{feedback}&nbsp;</p>
          </section>
        )}
      </div>
    </main>
  );
};

export default GameMathematiques;
