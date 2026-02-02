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
      className="fixed top-4 right-4 z-50 relative w-20 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-zinc-400 dark:border-zinc-600"
      aria-label={`Current theme: ${theme}. Click to toggle theme.`}
      title={`Toggle theme`}
    >
      {/* Slider Track with emojis */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <span className="text-lg z-10">☀️</span>
        <span className="text-lg z-10">🌙</span>
      </div>

      {/* Sliding indicator */}
      <div
        className={`absolute top-1 w-8 h-8 bg-white dark:bg-zinc-900 rounded-full shadow-md transition-all duration-300 ease-in-out ${
          theme === 'light' ? 'left-1' : 'left-11'
        }`}
      />
    </button>
  );
}
