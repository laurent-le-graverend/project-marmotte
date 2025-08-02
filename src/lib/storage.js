const SCORES_KEY = 'scores';
const PLAYER_NAME_KEY = 'playerName';

export const getPlayerName = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(PLAYER_NAME_KEY) || '';
};

export const setPlayerName = (name) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLAYER_NAME_KEY, name);
};

export const getScores = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY)) || {};
  } catch {
    return {};
  }
};

export const getScore = () => {
  if (typeof window === 'undefined') return 0;
  const name = getPlayerName();
  const scores = getScores();
  return scores[name] || 0;
};

export const setScore = (score) => {
  if (typeof window === 'undefined') return;
  const name = getPlayerName();
  console.log('Scores:', { name, score });
  if (!name) return;
  const scores = { ...getScores(), [name]: score };
  console.log(SCORES_KEY, JSON.stringify(scores));
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
};
