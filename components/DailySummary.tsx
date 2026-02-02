"use client";

import Image from "next/image";
import { DayForecast } from "@/lib/types";
import { getWeatherIconUrl } from "@/lib/weather";

interface DailySummaryProps {
  forecasts: DayForecast[];
}

export default function DailySummary({ forecasts }: DailySummaryProps) {
  return (
    <div className="mb-12 overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        5-Day Overview
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {forecasts.map((day) => {
          // Get midday forecast or first available
          const representative = day.forecasts.find((f) =>
            f.dt_txt.includes("12:00:00")
          ) || day.forecasts[0];
          
          const weather = representative.weather[0];
          const iconUrl = getWeatherIconUrl(weather.icon);
          
          // Calculate daily high/low
          const temps = day.forecasts.map((f) => f.main.temp);
          const high = Math.round(Math.max(...temps));
          const low = Math.round(Math.min(...temps));
          
          // Format day name (e.g., "Mon" or "Today")
          const dayDate = new Date(day.date + "T12:00:00");
          const today = new Date();
          const isToday = dayDate.toDateString() === today.toDateString();
          const dayLabel = isToday
            ? "Today"
            : dayDate.toLocaleDateString("en-US", { weekday: "short" });

          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-blue-800 dark:hover:bg-blue-900/20"
            >
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {dayLabel}
              </span>
              <div className="relative h-12 w-12">
                <Image
                  src={iconUrl}
                  alt={weather.description}
                  width={48}
                  height={48}
                  unoptimized
                  className="animate-float"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {high}°
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {low}°
                </span>
              </div>
              <span className="text-center text-xs capitalize text-zinc-600 dark:text-zinc-400">
                {weather.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
