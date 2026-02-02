import Link from "next/link";
import { getForecast } from "@/lib/weather";
import ForecastCard from "@/components/ForecastCard";
import DailySummary from "@/components/DailySummary";

interface WeatherPageProps {
  params: Promise<{ zip: string }>;
}

export async function generateMetadata({ params }: WeatherPageProps) {
  const { zip } = await params;
  return {
    title: `Weather Forecast for ${zip}`,
    description: `5-day weather forecast for zip code ${zip}`,
  };
}

export default async function WeatherPage({ params }: WeatherPageProps) {
  const { zip } = await params;
  const result = await getForecast(zip);

  if (result.error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
          >
            ← Back to search
          </Link>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mt-4">
            <h1 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error
            </h1>
            <p className="text-red-700 dark:text-red-300">
              {result.error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { forecasts, city } = result.data;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to search
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
          Weather Forecast for {city.name}, {city.country}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">Zip code: {zip}</p>

        <DailySummary forecasts={forecasts} />

        <div className="space-y-8">
          {forecasts.map((day) => (
            <section key={day.date}>
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                {day.dayName}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {day.forecasts.map((forecast) => (
                  <ForecastCard key={forecast.dt} forecast={forecast} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
