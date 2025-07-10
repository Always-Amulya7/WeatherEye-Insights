import type { LucideIcon } from "lucide-react";
export interface WeatherData {
  date: string;
  dayOfWeek: string;
  temp: number;
  condition: string;
  icon: LucideIcon;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  cloudOvercast: string;
  cycloneType?: string;
}
export interface ClusterAnalysisResult {
  clusterType: string;
  patterns: string;
  confidence: number;
}
export interface SatelliteSummaryResult {
  summary: string;
  keyDecisionPoints: string[];
}
export interface HourlyData {
  time: string;
  condition: string;
  cloudCover: number;
  precipitationChance: number;
  temp: number;
  humidity: number;
}
export interface LocationPin {
  lat: number;
  lng: number;
  description?: string;
}
export interface CorrelationResult {
  hourlyData: HourlyData[];
  locationPins?: LocationPin[];
}
