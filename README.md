# Weather Forecast App

A server-side rendered Next.js application that displays a 5-day weather forecast in 3-hour increments for any US zip code.

## Features

- SSR (Server-Side Rendering) for fast initial page loads
- 5-day forecast with 3-hour intervals
- Horizontal scroll layout for easy scanning
- Dark mode support
- Responsive design

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get an OpenWeather API key

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Go to your API keys section in the dashboard
3. Copy your API key

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a US zip code (e.g., 90210) in the search box
2. Click "Get Forecast" or press Enter
3. View the 5-day forecast organized by day with 3-hour intervals

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with SSR
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [OpenWeather API](https://openweathermap.org/api) - Weather data
