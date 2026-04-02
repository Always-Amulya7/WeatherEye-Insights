<div align="center">

# 🌤️ WeatherEye Insights

### AI-Powered Tropical Cloud Cluster Identification & Weather Analysis

Next.js, React, TypeScript, tailwind CSS, Google Gemini AI

[Features](#-features) • [Demo](#-demo) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**WeatherEye Insights** is an advanced AI-powered weather analysis platform that combines cutting-edge machine learning with meteorological expertise. The application leverages Google's Gemini 2.0 Flash model to identify tropical cloud clusters from satellite images, generate weather forecasts, and provide actionable insights for meteorologists and weather enthusiasts.

### 🎯 Key Capabilities

- **Cloud Cluster Identification**: Upload satellite images and get AI-powered analysis of cloud formations
- **7-Day Weather Forecast**: Generate detailed weather forecasts for any location worldwide
- **Satellite Data Summarization**: Convert complex satellite data into actionable meteorological insights
- **Micro-Forecast Generation**: Get 3-hour hourly forecasts based on cloud pattern analysis
- **Location Visualization**: Generate scenic images of any location using AI
- **Interactive Maps**: Real-time weather data with Google Maps integration

---

## ✨ Features

### 🔬 AI-Powered Analysis

| Feature | Description |
|---------|-------------|
| **Cloud Cluster Identification** | Analyze satellite images to identify cloud types, patterns, and confidence levels |
| **Weather Forecasting** | Generate realistic 7-day forecasts with temperature, humidity, precipitation, and wind data |
| **Satellite Data Summary** | Summarize complex satellite data with key decision points for meteorologists |
| **Cloud Data Correlation** | Correlate cloud images with hourly weather predictions and plausible locations |
| **Location Image Generation** | Create hyperrealistic images of any location using AI |

### 🗺️ Interactive Features

- **Live Weather Map**: Click anywhere on the map to get instant weather details
- **Location Search**: Search for any location with Google Places autocomplete
- **Weather Alerts**: Dynamic alerts for cyclones, high humidity, strong winds, and heavy rain
- **Data Export**: Download analysis reports as text files
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📊 Data Visualization

- **7-Day Forecast Cards**: Visual weather cards with icons, temperature, and conditions
- **Hourly Forecast Charts**: Interactive charts showing temperature and precipitation trends
- **Weather Metrics**: Detailed widgets for humidity, wind speed, cloud cover, and more
- **Cyclone Warnings**: Visual alerts for tropical storms and cyclones

---

## 🚀 Demo

### Main Dashboard
The main dashboard provides a comprehensive weather overview with:
- Location search with autocomplete
- 7-day weather forecast cards
- Dynamic weather alerts
- Cloud image upload and analysis

### Cloud Analysis
Upload satellite images to get:
- Cloud cluster type identification
- Pattern analysis
- Confidence scores
- 3-hour micro-forecasts
- Plausible location mapping

### Live Map
Interactive map features:
- Click-to-get-weather functionality
- Real-time weather data
- AI-generated location images
- Detailed weather metrics

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css) ![Radix UI](https://img.shields.io/badge/Radix_UI-Components-161618?style=flat-square) ![Recharts](https://img.shields.io/badge/Recharts-2.15.1-2196F3?style=flat-square) ![Lucide](https://img.shields.io/badge/Lucide-Icons-F59E0B?style=flat-square)

### Backend & AI
![Google Genkit](https://img.shields.io/badge/Google_Genkit-1.13.0-4285F4?style=flat-square&logo=google) ![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat-square&logo=google) ![Google Maps](https://img.shields.io/badge/Google_Maps-API-34A853?style=flat-square&logo=google-maps) ![Geocoding](https://img.shields.io/badge/Geocoding-API-34A853?style=flat-square) ![Places](https://img.shields.io/badge/Places-API-34A853?style=flat-square)

### Development & Deployment
![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?style=flat-square&logo=eslint) ![npm](https://img.shields.io/badge/npm-Package_Manager-CB3837?style=flat-square&logo=npm) ![Firebase](https://img.shields.io/badge/Firebase-App_Hosting-FFCA28?style=flat-square&logo=firebase)

</div>

---

## 📁 Project Structure

```
weathereye-insights/
├── src/
│   ├── ai/                          # AI/ML related code
│   │   ├── genkit.ts               # Genkit AI configuration
│   │   ├── dev.ts                  # Development server setup
│   │   └── flows/                  # AI workflow definitions
│   │       ├── cloud-cluster-identifier.ts
│   │       ├── correlate-cloud-data.ts
│   │       ├── generate-location-image.ts
│   │       ├── get-weather-forecast.ts
│   │       └── summarize-satellite-data.ts
│   ├── app/                        # Next.js app directory
│   │   ├── actions.ts             # Server actions
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── components/                 # React components
│   │   ├── ui/                    # Reusable UI components
│   │   ├── WeatherDashboard.tsx   # Main dashboard
│   │   ├── WeatherCard.tsx        # Weather forecast card
│   │   ├── LiveWeatherMap.tsx     # Interactive map
│   │   ├── LocationSearch.tsx     # Location search
│   │   ├── HourlyForecastChart.tsx # Hourly charts
│   │   └── DynamicWeatherDisplay.tsx # Weather alerts
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib/                        # Utility functions
│       ├── types.ts               # TypeScript types
│       ├── mock-data.ts           # Mock data
│       └── utils.ts               # Utility functions
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── next.config.ts                 # Next.js configuration
└── apphosting.yaml                # Firebase configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Google Cloud Project** with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Generative Language API (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weathereye-insights.git
   cd weathereye-insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Maps API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Google AI API Key (for Gemini)
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:9002](http://localhost:9002)

### Running AI Development Server

To run the Genkit AI development server:
```bash
npm run genkit:dev
```

For watch mode:
```bash
npm run genkit:watch
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack on port 9002 |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint for code linting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run genkit:dev` | Start Genkit AI development server |
| `npm run genkit:watch` | Start Genkit AI with watch mode |

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |
| `GOOGLE_API_KEY` | Google AI API key for Gemini | Yes |

### Getting API Keys

1. **Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Maps JavaScript API, Places API, and Geocoding API
   - Create credentials (API Key)
   - Restrict the key to your domain

2. **Google AI API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Copy the key to your `.env.local` file

---

## 🏗️ Architecture

### AI Workflows

The application uses Google Genkit to define AI workflows:

```typescript
// Example: Cloud Cluster Identification Flow
const identifyCloudClustersFlow = ai.defineFlow(
  {
    name: "identifyCloudClustersFlow",
    inputSchema: IdentifyCloudClustersInputSchema,
    outputSchema: IdentifyCloudClustersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
```

### Server Actions

Server actions handle AI processing and data fetching:

```typescript
// Example: Analyze Cloud Image
export async function analyzeCloudImage(
  photoDataUri: string
): Promise<ClusterAnalysisResult | { error: string }> {
  try {
    const result = await identifyCloudClusters({ photoDataUri });
    return result.clusterAnalysis;
  } catch (e) {
    return { error: "Failed to analyze cloud image." };
  }
}
```

### Component Architecture

```
WeatherDashboard (Main Container)
├── LocationSearch (Location input)
├── DynamicWeatherDisplay (Weather alerts)
├── WeatherCard[] (7-day forecast)
├── LiveWeatherMap (Interactive map)
└── HourlyForecastChart (Data visualization)
```

---

## 📊 API Reference

### Cloud Cluster Identification

**Input**: Cloud image as data URI
**Output**:
```typescript
{
  clusterType: string;      // e.g., "Cumulonimbus", "Stratocumulus"
  patterns: string;         // Description of observed patterns
  confidence: number;       // Confidence level (0-1)
}
```

### Weather Forecast

**Input**: Location name or coordinates
**Output**:
```typescript
{
  forecast: Array<{
    date: string;
    dayOfWeek: string;
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    cloudOvercast: string;
    cycloneType?: string;
  }>;
}
```

### Cloud Data Correlation

**Input**: Cloud image and cluster analysis
**Output**:
```typescript
{
  hourlyData: Array<{
    time: string;
    condition: string;
    cloudCover: number;
    precipitationChance: number;
    temp: number;
    humidity: number;
  }>;
  locationPins?: Array<{
    lat: number;
    lng: number;
    description?: string;
  }>;
}
```

---

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI:

- **Accordion**: Collapsible content sections
- **Alert Dialog**: Modal confirmations
- **Avatar**: User avatars
- **Badge**: Status indicators
- **Button**: Action buttons
- **Card**: Content containers
- **Chart**: Data visualization
- **Dialog**: Modal windows
- **Dropdown Menu**: Context menus
- **Form**: Form controls
- **Input**: Text inputs
- **Progress**: Progress indicators
- **Select**: Dropdown selects
- **Sheet**: Side panels
- **Sidebar**: Navigation sidebar
- **Tabs**: Tabbed interfaces
- **Toast**: Notifications
- **Tooltip**: Hover information

---

## 🚢 Deployment

### Firebase App Hosting

The application is configured for Firebase App Hosting:

```yaml
# apphosting.yaml
runConfig:
  maxInstances: 1
```

To deploy:

1. Install Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```bash
   firebase login
   ```

3. Initialize Firebase
   ```bash
   firebase init
   ```

4. Deploy
   ```bash
   firebase deploy
   ```

### Vercel

The application can also be deployed to Vercel:

```bash
npm install -g vercel
vercel
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Google Genkit](https://firebase.google.com/docs/genkit) - AI workflow framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Composable charting library
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons

---

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

<div align="center">

**[⬆ Back to Top](#-weathereye-insights)**

Made with ❤️ by [Your Name]

</div>
