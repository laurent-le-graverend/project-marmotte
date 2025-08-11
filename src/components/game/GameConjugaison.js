import React, { useEffect, useState } from 'react';

import GameSetup from '@/components/game/GameSetup';
import SessionStats from '@/components/game/SessionStats';
import GameHUD from '@/components/ui/GameHUD';
import useGameTimer from '@/hooks/useGameTimer';

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
  // Session state management
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'stats'
  const [sessionConfig, setSessionConfig] = useState({
    mode: 'simple',
    totalQuestions: null, // null for free play
  });

  // Game state
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentScore, setCurrentScore] = useState(() => getScore());
  const [isChecking, setIsChecking] = useState(false);

  // Session tracking
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [finalSessionTime, setFinalSessionTime] = useState(null);

  // Use the custom timer hook
  const { elapsedTime, formatTime } = useGameTimer(question);

  // Start a new game with the selected configuration
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(1);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setFinalSessionTime(null);
    setSessionStartTime(Date.now());
    setQuestion(getRandomQuestion(sessionConfig.mode));
  };

  // Quit the current session
  const quitSession = () => {
    // Calculate and store the final session time when quitting
    if (sessionStartTime && !finalSessionTime) {
      setFinalSessionTime(Math.round((Date.now() - sessionStartTime) / 1000));
    }
    setGameState('stats');
  };

  // Check if session should end (when total questions limit reached)
  useEffect(() => {
    if (gameState === 'playing' && sessionConfig.totalQuestions && currentQuestion > sessionConfig.totalQuestions) {
      // Calculate and store the final session time when game ends naturally
      if (sessionStartTime && !finalSessionTime) {
        setFinalSessionTime(Math.round((Date.now() - sessionStartTime) / 1000));
      }
      setGameState('stats');
    }
  }, [currentQuestion, sessionConfig.totalQuestions, gameState, sessionStartTime, finalSessionTime]);

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
      // Check if we've reached the question limit
      if (sessionConfig.totalQuestions && currentQuestion >= sessionConfig.totalQuestions) {
        // Calculate and store the final session time when game ends
        if (sessionStartTime && !finalSessionTime) {
          setFinalSessionTime(Math.round((Date.now() - sessionStartTime) / 1000));
        }
        setGameState('stats');
      } else {
        setQuestion(getRandomQuestion(sessionConfig.mode));
        setCurrentQuestion((prev) => prev + 1);
        setAnswer('');
        setFeedback('');
        setIsChecking(false);
      }
    }, 2500);
  };

  // Reset to setup screen
  const resetToSetup = () => {
    setGameState('setup');
    setQuestion(null);
    setAnswer('');
    setFeedback('');
    setIsChecking(false);
    setFinalSessionTime(null);
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <GameSetup
        title="Configuration - Jeu de Conjugaison"
        onStartGame={startGame}
        canStart={true}
      >
        <div>
          <h3 className="mb-3 font-bold text-gray-700">Mode de difficulté :</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 rounded-lg px-4 py-2 font-bold ${
                sessionConfig.mode === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => setSessionConfig((prev) => ({ ...prev, mode: 'simple' }))}
            >
              Simple (être, avoir)
            </button>
            <button
              className={`flex-1 rounded-lg px-4 py-2 font-bold ${
                sessionConfig.mode === 'advanced' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'
              }`}
              onClick={() => setSessionConfig((prev) => ({ ...prev, mode: 'advanced' }))}
            >
              Avancé (tous verbes)
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
    // Use the stored final session time instead of calculating it continuously
    const totalSessionTime = finalSessionTime || Math.round((Date.now() - sessionStartTime) / 1000);
    const totalAnswered = correctAnswers + incorrectAnswers;

    return (
      <SessionStats
        totalQuestions={totalAnswered}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        totalTime={totalSessionTime}
        onPlayAgain={resetToSetup}
        onBackToMenu={() => window.history.back()}
        breakdown={{
          Mode: sessionConfig.mode === 'simple' ? 'Simple (être, avoir)' : 'Avancé (tous verbes)',
          'Type de session': sessionConfig.totalQuestions ? `${sessionConfig.totalQuestions} questions` : 'Jeu libre',
        }}
      />
    );
  }

  // Playing screen
  if (!question) return <div className="flex h-96 items-center justify-center">Chargement…</div>;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
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
        <section className="flex flex-1 flex-col items-center rounded-xl border border-white/20 bg-white/95 p-4 shadow-md backdrop-blur-sm md:p-6">
          <h2 className="mb-4 text-center text-xl font-bold text-blue-700">
            Question {currentQuestion}
            {sessionConfig.totalQuestions && ` / ${sessionConfig.totalQuestions}`}
          </h2>
          <h2 className="mb-4 text-center text-lg font-bold text-gray-800">
            Conjugue <span className="font-extrabold text-blue-600">&quot;{question.verbe}&quot;</span> <br />
            au <span className="font-extrabold text-green-600">&quot;{question.temps}&quot;</span> <br />
            avec <span className="font-extrabold text-pink-600">&quot;{question.sujet}&quot;</span>
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
              disabled={isChecking || feedback.length || answer.trim() === ''}
              className="w-full rounded-lg bg-blue-500 py-3 text-lg font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Valider
            </button>
          </form>
          <p className="mt-4 text-center text-xl font-semibold">{feedback}&nbsp;</p>
        </section>
      </div>
    </main>
  );
};

export default GameConjugaison;
