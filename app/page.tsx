"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "recentSearches";

// localStorage utilities
const loadRecentSearches = (): string[] => {
  try {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load recent searches:", error);
    return [];
  }
};

const saveRecentSearches = (searches: string[]): void => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch (error) {
    console.error("Failed to save recent searches:", error);
  }
};

export default function Home() {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  const addToRecentSearches = (zipCode: string): void => {
    setRecentSearches((prev) => {
      // Remove if already exists (deduplication)
      const filtered = prev.filter((z) => z !== zipCode);
      // Add to beginning and limit to 5
      const updated = [zipCode, ...filtered].slice(0, 5);
      // Save to localStorage
      saveRecentSearches(updated);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedZip = zip.trim();
    if (!/^\d{5}$/.test(trimmedZip)) {
      setError("Please enter a valid 5-digit US zip code");
      return;
    }

    // Add to recent searches before navigating
    addToRecentSearches(trimmedZip);
    router.push(`/weather/${trimmedZip}`);
  };

  const handleRecentSearchClick = (zipCode: string) => {
    router.push(`/weather/${zipCode}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-8">
      <main className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Weather Forecast
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter a US zip code to see the 5-day weather forecast
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g., 90210"
              maxLength={5}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Get Forecast
          </button>
        </form>

        {recentSearches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Recent Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((zipCode) => (
                <button
                  key={zipCode}
                  onClick={() => handleRecentSearchClick(zipCode)}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-750 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors text-sm text-zinc-900 dark:text-zinc-100"
                >
                  {zipCode}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
