// OpenWeather API response types

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  pop: number; // Probability of precipitation
  visibility: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DayForecast {
  date: string;
  dayName: string;
  forecasts: ForecastItem[];
}

export interface WeatherError {
  message: string;
  code?: string;
}

export type WeatherResult =
  | { data: { forecasts: DayForecast[]; city: ForecastResponse["city"] }; error: null }
  | { data: null; error: WeatherError };
