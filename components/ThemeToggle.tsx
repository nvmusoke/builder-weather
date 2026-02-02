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
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 relative w-14 h-7 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border ${
        isDark
          ? 'bg-zinc-700 border-zinc-600'
          : 'bg-zinc-300 border-zinc-400'
      }`}
      aria-label={`Current theme: ${theme}. Click to toggle theme.`}
      title={`Toggle theme`}
    >
      {/* Slider Track with emojis */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <span className="text-xs z-10">☀️</span>
        <span className="text-xs z-10">🌙</span>
      </div>

      {/* Sliding indicator */}
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 ease-in-out ${
          isDark ? 'left-7 bg-zinc-900' : 'left-0.5 bg-white'
        }`}
      />
    </button>
  );
}
