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
 * Converts a UTC timestamp to a Date adjusted for the location's timezone
 */
function getLocalDate(utcTimestamp: number, timezoneOffset: number): Date {
  // Apply timezone offset to get local time at the location
  return new Date((utcTimestamp + timezoneOffset) * 1000);
}

/**
 * Groups forecast items by day using the location's timezone
 */
export function groupForecastsByDay(
  forecasts: ForecastItem[],
  timezoneOffset: number
): DayForecast[] {
  const grouped = new Map<string, ForecastItem[]>();

  for (const forecast of forecasts) {
    const localDate = getLocalDate(forecast.dt, timezoneOffset);
    // Use UTC methods since we've already applied the offset
    const dateKey = localDate.toISOString().split("T")[0];
    const existing = grouped.get(dateKey) || [];
    existing.push(forecast);
    grouped.set(dateKey, existing);
  }

  return Array.from(grouped.entries()).map(([date, items]) => {
    // Parse the date key and format for display
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
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
 * Formats time from UTC timestamp to readable format using location's timezone
 */
export function formatTime(
  utcTimestamp: number,
  timezoneOffset: number
): string {
  const localDate = getLocalDate(utcTimestamp, timezoneOffset);
  // Extract hours and minutes from the adjusted UTC time
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${period}`;
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
    const forecasts = groupForecastsByDay(data.list, data.city.timezone);

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
