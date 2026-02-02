'use client';

import { useTheme } from '@/lib/theme-context';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch and SSR issues
  if (!mounted) {
    return null;
  }

  return <ThemeToggleClient />;
}

function ThemeToggleClient() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-zinc-300 dark:border-zinc-700"
      aria-label={`Current theme: ${theme}. Click to toggle theme.`}
      title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
    >
      {/* Icon container with animations */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon (Light Mode) */}
        <svg
          className={`absolute w-5 h-5 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          className={`absolute w-5 h-5 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      {/* Theme Label */}
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-[60px] text-left">
        {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </span>
    </button>
  );
}
