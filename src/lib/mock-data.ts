import { Sun, Cloudy, Cloud, CloudRain, Zap, Tornado } from "lucide-react";
import type { WeatherData } from "./types";
const getDayOfWeek = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};
export const sevenDayForecast: WeatherData[] = [
  {
    date: "3 days ago",
    dayOfWeek: getDayOfWeek(-3),
    temp: 23,
    condition: "Sunny",
    icon: Sun,
    humidity: 60,
    precipitation: 0,
    windSpeed: 10,
    cloudOvercast: "15%",
  },
  {
    date: "2 days ago",
    dayOfWeek: getDayOfWeek(-2),
    temp: 24,
    condition: "Partly Cloudy",
    icon: Cloudy,
    humidity: 65,
    precipitation: 5,
    windSpeed: 12,
    cloudOvercast: "30%",
  },
  {
    date: "Yesterday",
    dayOfWeek: getDayOfWeek(-1),
    temp: 22,
    condition: "Cloudy",
    icon: Cloud,
    humidity: 75,
    precipitation: 10,
    windSpeed: 15,
    cloudOvercast: "60%",
  },
  {
    date: "Today",
    dayOfWeek: getDayOfWeek(0),
    temp: 20,
    condition: "Rainy",
    icon: CloudRain,
    humidity: 85,
    precipitation: 40,
    windSpeed: 20,
    cloudOvercast: "90%",
    cycloneType: "Tropical Storm",
  },
  {
    date: "Tomorrow",
    dayOfWeek: getDayOfWeek(1),
    temp: 21,
    condition: "Thunderstorm",
    icon: Zap,
    humidity: 90,
    precipitation: 60,
    windSpeed: 25,
    cloudOvercast: "95%",
    cycloneType: "Category 1",
  },
  {
    date: "In 2 days",
    dayOfWeek: getDayOfWeek(2),
    temp: 25,
    condition: "Partly Cloudy",
    icon: Cloudy,
    humidity: 70,
    precipitation: 15,
    windSpeed: 18,
    cloudOvercast: "40%",
  },
  {
    date: "In 3 days",
    dayOfWeek: getDayOfWeek(3),
    temp: 27,
    condition: "Sunny",
    icon: Sun,
    humidity: 55,
    precipitation: 0,
    windSpeed: 8,
    cloudOvercast: "10%",
  },
];
export const defaultLocation = "Bay of Bengal";
