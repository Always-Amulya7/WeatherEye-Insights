"use client";
import { Tornado, AlertTriangle, CloudRain } from "lucide-react";
import type { WeatherData } from "@/lib/types";
interface DynamicWeatherDisplayProps {
  forecast: WeatherData[];
}
export default function DynamicWeatherDisplay({
  forecast,
}: DynamicWeatherDisplayProps) {
  const alerts: { icon: React.FC<any>; text: string }[] = [];
  if (!forecast) return null;
  forecast.forEach((day) => {
    const dayLabel =
      day.date === "Today" || day.date === "Tomorrow"
        ? day.date
        : `On ${day.dayOfWeek}`;
    if (day.cycloneType) {
      alerts.push({
        icon: Tornado,
        text: `${dayLabel.toUpperCase()}: CYCLONE ALERT - ${day.cycloneType.toUpperCase()}`,
      });
    }
    if (day.humidity > 90) {
      alerts.push({
        icon: AlertTriangle,
        text: `${dayLabel.toUpperCase()}: HIGH HUMIDITY - ${day.humidity}%`,
      });
    }
    if (day.windSpeed > 40) {
      alerts.push({
        icon: AlertTriangle,
        text: `${dayLabel.toUpperCase()}: STRONG WINDS - ${day.windSpeed} km/h`,
      });
    }
    if (day.precipitation > 70) {
      alerts.push({
        icon: CloudRain,
        text: `${dayLabel.toUpperCase()}: HEAVY RAIN - ${
          day.precipitation
        }% CHANCE`,
      });
    }
  });
  if (alerts.length === 0) {
    return null;
  }
  const extendedAlerts =
    alerts.length > 3
      ? [...alerts, ...alerts]
      : [...alerts, ...alerts, ...alerts, ...alerts];
  return (
    <div className="relative flex overflow-x-hidden bg-accent/90 text-accent-foreground rounded-lg py-3">
      <div className="py-2 animate-marquee whitespace-nowrap flex">
        {extendedAlerts.map((alert, index) => (
          <div
            key={`marquee1-${index}`}
            className="flex items-center space-x-2 mx-4"
          >
            <alert.icon className="w-5 h-5" />
            <span className="font-bold font-headline text-sm tracking-wider">
              {alert.text}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute top-0 bottom-0 py-2 animate-marquee2 whitespace-nowrap flex">
        {extendedAlerts.map((alert, index) => (
          <div
            key={`marquee2-${index}`}
            className="flex items-center space-x-2 mx-4"
          >
            <alert.icon className="w-5 h-5" />
            <span className="font-bold font-headline text-sm tracking-wider">
              {alert.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
