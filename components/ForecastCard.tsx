"use client";

import Image from "next/image";
import { ForecastItem } from "@/lib/types";
import { getWeatherIconUrl, formatTime } from "@/lib/weather";

interface ForecastCardProps {
  forecast: ForecastItem;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const weather = forecast.weather[0];
  const iconUrl = getWeatherIconUrl(weather.icon);
  const time = formatTime(forecast.dt_txt);

  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 min-w-[120px]">
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {time}
      </span>
      <Image
        src={iconUrl}
        alt={weather.description}
        width={50}
        height={50}
        unoptimized
      />
      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {Math.round(forecast.main.temp)}°F
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize text-center">
        {weather.description}
      </span>
      <div className="mt-2 flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>Humidity: {forecast.main.humidity}%</span>
        <span>Wind: {Math.round(forecast.wind.speed)} mph</span>
      </div>
    </div>
  );
}
