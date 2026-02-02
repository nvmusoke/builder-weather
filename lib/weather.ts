import {
  ForecastResponse,
  ForecastItem,
  DayForecast,
  WeatherResult,
} from "./types";

const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

/**
 * Validates a US zip code format (5 digits)
 */
function isValidZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

/**
 * Groups forecast items by day
 */
export function groupForecastsByDay(forecasts: ForecastItem[]): DayForecast[] {
  const grouped = new Map<string, ForecastItem[]>();

  for (const forecast of forecasts) {
    const date = forecast.dt_txt.split(" ")[0];
    const existing = grouped.get(date) || [];
    existing.push(forecast);
    grouped.set(date, existing);
  }

  return Array.from(grouped.entries()).map(([date, items]) => {
    const dateObj = new Date(date + "T12:00:00");
    return {
      date,
      dayName: dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      forecasts: items,
    };
  });
}

/**
 * Builds the OpenWeather icon URL
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Formats time from ISO string to readable format (e.g., "3:00 PM")
 */
export function formatTime(dtTxt: string): string {
  const date = new Date(dtTxt);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Fetches 5-day weather forecast for a US zip code
 */
export async function getForecast(zip: string): Promise<WeatherResult> {
  if (!isValidZipCode(zip)) {
    return {
      data: null,
      error: {
        message: "Invalid zip code format. Please enter a 5-digit US zip code.",
        code: "INVALID_ZIP",
      },
    };
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      data: null,
      error: {
        message: "Weather API key is not configured.",
        code: "MISSING_API_KEY",
      },
    };
  }

  const url = `${OPENWEATHER_API_URL}?zip=${zip},US&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: null,
          error: {
            message: `No weather data found for zip code ${zip}. Please check the zip code and try again.`,
            code: "NOT_FOUND",
          },
        };
      }
      if (response.status === 401) {
        return {
          data: null,
          error: {
            message: "Invalid API key. Please check your OpenWeather API key.",
            code: "INVALID_API_KEY",
          },
        };
      }
      return {
        data: null,
        error: {
          message: `Failed to fetch weather data. Status: ${response.status}`,
          code: "API_ERROR",
        },
      };
    }

    const data: ForecastResponse = await response.json();
    const forecasts = groupForecastsByDay(data.list);

    return {
      data: {
        forecasts,
        city: data.city,
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: {
        message:
          "Failed to connect to weather service. Please try again later.",
        code: "NETWORK_ERROR",
      },
    };
  }
}
