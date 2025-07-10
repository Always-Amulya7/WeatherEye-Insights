import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Wind, Droplets, Cloud as CloudIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeatherData } from "@/lib/types";
import { Badge } from "./ui/badge";
interface WeatherCardProps {
  data: WeatherData;
  isToday?: boolean;
}
export default function WeatherCard({
  data,
  isToday = false,
}: WeatherCardProps) {
  const Icon = data.icon;
  return (
    <Card
      className={cn(
        "w-full text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
        isToday
          ? "bg-primary/20 border-primary scale-105 shadow-2xl z-10"
          : "bg-card"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-headline">
          {data.dayOfWeek}
        </CardTitle>
        <CardDescription>{data.date}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 flex-grow justify-between">
        <div className="flex flex-col items-center gap-2">
          <Icon
            className={cn(
              "w-16 h-16",
              isToday ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-4xl font-bold font-headline">{data.temp}°C</p>
          <p className="text-muted-foreground">{data.condition}</p>
          {data.cycloneType && (
            <Badge variant="destructive" className="mt-1 animate-pulse">
              {data.cycloneType}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm w-full pt-4 border-t mt-2">
          <div className="flex items-center gap-1.5 justify-center">
            <Droplets className="w-4 h-4 text-primary" />
            <span>{data.humidity}% Hum.</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Wind className="w-4 h-4 text-primary" />
            <span>{data.windSpeed} km/h</span>
          </div>
          <div className="col-span-2 flex items-center gap-1.5 justify-center">
            <CloudIcon className="w-4 h-4 text-primary" />
            <span>{data.cloudOvercast} Overcast</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
