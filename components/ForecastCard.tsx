"use client";

import Image from "next/image";
import { ForecastItem } from "@/lib/types";
import { getWeatherIconUrl, formatTime, getWeatherAnimation } from "@/lib/weather";

interface ForecastCardProps {
  forecast: ForecastItem;
  timezone: number;
}

export default function ForecastCard({ forecast, timezone }: ForecastCardProps) {
  const weather = forecast.weather[0];
  const iconUrl = getWeatherIconUrl(weather.icon);
  const time = formatTime(forecast.dt, timezone);
  const feelsLike = Math.round(forecast.main.feels_like);
  const temp = Math.round(forecast.main.temp);
  const animationClass = getWeatherAnimation(weather.main);

  return (
    <div className="group relative flex min-w-[140px] flex-col items-center gap-2 overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-lg dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-850 dark:hover:border-blue-700">
      {/* Time */}
      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        {time}
      </span>

      {/* Weather Icon with Animation */}
      <div className="relative h-16 w-16">
        <Image
          src={iconUrl}
          alt={weather.description}
          width={64}
          height={64}
          unoptimized
          className={`${animationClass} drop-shadow-md`}
        />
      </div>

      {/* Temperature */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {temp}°
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-300">
          Feels like {feelsLike}°
        </span>
      </div>

      {/* Weather Description */}
      <span className="text-center text-xs capitalize text-zinc-600 dark:text-zinc-300">
        {weather.description}
      </span>

      {/* Divider */}
      <div className="my-1 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700"></div>

      {/* Additional Info */}
      <div className="flex w-full flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5V4h8V2.5a.5.5 0 011 0V4h.5A2.5 2.5 0 0118 6.5v9a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-9A2.5 2.5 0 014.5 4H5V2.5a.5.5 0 01.5-.5zM4.5 5A1.5 1.5 0 003 6.5V8h14V6.5A1.5 1.5 0 0015.5 5h-11zM17 9H3v6.5A1.5 1.5 0 004.5 17h11a1.5 1.5 0 001.5-1.5V9z" clipRule="evenodd" />
            </svg>
            {forecast.main.humidity}%
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">humidity</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a.75.75 0 01.75.75v.258a7.001 7.001 0 016.994 6.994h.258a.75.75 0 010 1.5h-.258a7.001 7.001 0 01-6.994 6.994v.258a.75.75 0 01-1.5 0v-.258a7.001 7.001 0 01-6.994-6.994H2.75a.75.75 0 010-1.5h.258a7.001 7.001 0 016.994-6.994V2.75A.75.75 0 0110 2zm0 3a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
            </svg>
            {Math.round(forecast.wind.speed)} mph
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">wind</span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-600/10 dark:to-purple-600/10"></div>
      </div>
    </div>
  );
}
