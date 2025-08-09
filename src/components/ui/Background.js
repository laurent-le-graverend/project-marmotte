'use client';

import { useEffect, useState } from 'react';

const Background = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get mouse position relative to viewport center
      const centerX = window.innerWidth / 2;
      const offsetX = (e.clientX - centerX) / centerX; // -1 to 1 range
      setMousePosition({ x: offsetX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sky Background - top portion */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200" />

      {/* Grass Background - bottom 2/3 with curved hill effect */}
      <div className="absolute right-0 bottom-0 left-0 h-2/3">
        {/* Main grass area */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500 via-green-400 to-green-300" />

        {/* Curved hill overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-green-600 via-green-500 to-transparent"
          style={{
            clipPath: 'ellipse(100% 60% at 50% 100%)',
          }}
        />

        {/* Additional hill layers for depth */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-green-700 via-green-600 to-transparent opacity-30"
          style={{
            clipPath: 'ellipse(80% 40% at 30% 100%)',
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-green-700 via-green-600 to-transparent opacity-20"
          style={{
            clipPath: 'ellipse(70% 35% at 70% 100%)',
          }}
        />
      </div>

      {/* Animated Clouds */}
      <div className="pointer-events-none absolute inset-0">
        {/* Cloud 1 */}
        <div
          className="absolute top-16 text-6xl text-white opacity-80 transition-transform duration-1000 ease-out"
          style={{
            left: `${20 - mousePosition.x * 5}%`,
            transform: 'translateX(-50%)',
          }}
        >
          ☁️
        </div>

        {/* Cloud 2 */}
        <div
          className="absolute top-32 text-5xl text-white opacity-70 transition-transform duration-1500 ease-out"
          style={{
            left: `${70 + mousePosition.x * 3}%`,
            transform: 'translateX(-50%)',
          }}
        >
          ☁️
        </div>

        {/* Cloud 3 */}
        <div
          className="absolute top-24 text-4xl text-white opacity-60 transition-transform duration-1200 ease-out"
          style={{
            left: `${45 - mousePosition.x * 4}%`,
            transform: 'translateX(-50%)',
          }}
        >
          ☁️
        </div>

        {/* Cloud 4 - smaller, higher */}
        <div
          className="absolute top-8 text-3xl text-white opacity-50 transition-transform duration-800 ease-out"
          style={{
            left: `${85 + mousePosition.x * 2}%`,
            transform: 'translateX(-50%)',
          }}
        >
          ☁️
        </div>

        {/* Cloud 5 - on the left */}
        <div
          className="absolute top-40 text-5xl text-white opacity-65 transition-transform duration-1300 ease-out"
          style={{
            left: `${10 - mousePosition.x * 6}%`,
            transform: 'translateX(-50%)',
          }}
        >
          ☁️
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
