import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for managing game timer functionality
 * @param {*} dependency - Dependency that triggers timer reset (usually question object)
 * @returns {Object} { elapsedTime, formatTime }
 */
const useGameTimer = (dependency) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    setElapsedTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [dependency]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { elapsedTime, formatTime };
};

export default useGameTimer;
