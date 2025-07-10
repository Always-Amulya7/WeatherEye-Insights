"use client";
import React, { useState, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertTriangle,
  Loader2,
  Sun,
  Cloudy,
  Cloud,
  CloudRain,
  Zap,
  Tornado,
  Wind,
  Droplets,
  MapPin,
} from "lucide-react";
import { getForecastForLocation, getLocationImage } from "@/app/actions";
import type { ApiWeatherData } from "@/ai/flows/get-weather-forecast";
import { useToast } from "@/hooks/use-toast";
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};
const center = {
  lat: 20,
  lng: 0,
};
const iconMap: { [key: string]: React.ElementType } = {
  Sun,
  Cloudy,
  Cloud,
  CloudRain,
  Zap,
  Tornado,
};
function InfoWidget({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
      <Icon className="w-6 h-6 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
function WeatherDetailsPanel({
  weather,
  imageUrl,
  isFetchingImage,
  isFetchingWeather,
}: {
  weather: ApiWeatherData | null;
  imageUrl: string | null;
  isFetchingImage: boolean;
  isFetchingWeather: boolean;
}) {
  const Icon = weather ? iconMap[weather.icon] : null;
  if (!imageUrl && !weather && !isFetchingImage && !isFetchingWeather) {
    return (
      <Card className="h-full w-full flex flex-col items-center justify-center text-center p-4 bg-muted/30 border-dashed">
        <div className="p-4 bg-background rounded-full mb-4 border">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-semibold text-lg">Live Weather</p>
        <p className="text-sm text-muted-foreground">
          Click anywhere on the map to get detailed weather information.
        </p>
      </Card>
    );
  }
  return (
    <Card className="h-full w-full flex flex-col overflow-hidden">
      <div
        className="relative flex-shrink-0 w-full text-white bg-cover bg-center bg-card aspect-video"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
        data-ai-hint="weather location"
      >
        {isFetchingImage && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="text-sm mt-2 text-white/80">
              Generating scenic image...
            </p>
          </div>
        )}
        {isFetchingWeather && imageUrl && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="text-sm mt-2 text-white/80">
              Fetching weather details...
            </p>
          </div>
        )}
        {imageUrl && <div className="absolute inset-0 bg-black/40"></div>}
        {!imageUrl && weather && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80"></div>
        )}
      </div>
      <CardContent className="flex-grow p-4 space-y-4 overflow-y-auto">
        {weather ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-4xl font-bold">{weather.temp}°C</p>
                <p className="font-medium text-muted-foreground">
                  {weather.condition}
                </p>
              </div>
              {Icon && (
                <Icon className="w-16 h-16 text-primary drop-shadow-lg" />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t">
              <InfoWidget
                icon={Droplets}
                title="Humidity"
                value={`${weather.humidity}%`}
              />
              <InfoWidget
                icon={Wind}
                title="Wind Speed"
                value={`${weather.windSpeed} km/h`}
              />
              <InfoWidget
                icon={Cloud}
                title="Overcast"
                value={weather.cloudOvercast}
              />
              <InfoWidget
                icon={CloudRain}
                title="Precipitation"
                value={`${weather.precipitation}%`}
              />
            </div>
            {weather.cycloneType && (
              <Badge
                variant="destructive"
                className="w-full justify-center animate-pulse mt-2"
              >
                {weather.cycloneType}
              </Badge>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full animate-pulse">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-8 w-24 mt-4" />
            <Skeleton className="h-6 w-32 mt-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default function LiveWeatherMap({
  isLoaded,
  loadError,
}: {
  isLoaded: boolean;
  loadError?: Error;
}) {
  const [clickedLatLng, setClickedLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [weatherData, setWeatherData] = useState<ApiWeatherData | null>(null);
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [locationImageUrl, setLocationImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setWeatherData(null);
        setLocationImageUrl(null);
        setClickedLatLng({ lat, lng });
        setIsFetchingImage(true);
        setIsFetchingWeather(true);
        if (!isLoaded || !window.google?.maps?.Geocoder) {
          console.error("Geocoder not available.");
          toast({
            variant: "destructive",
            title: "Map Error",
            description: "Could not fetch location details.",
          });
          setIsFetchingImage(false);
          setIsFetchingWeather(false);
          setClickedLatLng(null);
          return;
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          let locationName = "the current location";
          if (status === "OK" && results?.[0]) {
            const address = results[0].address_components;
            const locality = address.find((c) => c.types.includes("locality"));
            const country = address.find((c) => c.types.includes("country"));

            if (
              locality &&
              country &&
              locality.long_name !== country.long_name
            ) {
              locationName = `${locality.long_name}, ${country.long_name}`;
            } else if (locality) {
              locationName = locality.long_name;
            } else if (country) {
              locationName = country.long_name;
            } else {
              locationName = results[0].formatted_address
                .split(",")
                .slice(0, 2)
                .join(",");
            }
          }
          const fetchAndSetData = async () => {
            const imagePromise = getLocationImage(locationName);
            const weatherPromise = getForecastForLocation(`${lat},${lng}`);

            const imageResult = await imagePromise;
            if ("error" in imageResult) {
              console.error(imageResult.error);
            } else {
              setLocationImageUrl(imageResult.imageDataUri);
            }
            setIsFetchingImage(false);
            const weatherResult = await weatherPromise;
            if ("error" in weatherResult) {
              toast({
                variant: "destructive",
                title: "Forecast Failed",
                description: weatherResult.error,
              });
              setClickedLatLng(null);
              setWeatherData(null);
              setLocationImageUrl(null);
            } else {
              setWeatherData(weatherResult.forecast[0]);
            }
            setIsFetchingWeather(false);
          };
          fetchAndSetData();
        });
      }
    },
    [toast, isLoaded]
  );
  if (loadError) {
    return (
      <Card className="bg-destructive/20 border-destructive text-destructive-foreground p-4 flex items-center justify-center gap-4 h-full">
        <AlertTriangle className="w-8 h-8" />
        <div>
          <p className="font-bold">Map Error</p>
          <p className="text-sm">
            Could not load Google Maps. Please check your API key and ensure the
            'Maps JavaScript API', 'Places API', and 'Geocoding API' are enabled
            in your Google Cloud project.
          </p>
        </div>
      </Card>
    );
  }
  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full w-full">
        <Skeleton className="md:col-span-2 h-full w-full rounded-lg" />
        <Skeleton className="md:col-span-1 h-full w-full rounded-lg" />
      </div>
    );
  }
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 h-full min-h-[300px] rounded-lg overflow-hidden border">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={2}
          onClick={handleMapClick}
          mapTypeId="satellite"
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
            gestureHandling: "cooperative",
            draggableCursor: "crosshair",
            draggingCursor: "grabbing",
            disableDefaultUI: true,
          }}
        >
          {clickedLatLng && <Marker position={clickedLatLng} />}
        </GoogleMap>
      </div>
      <div className="md:col-span-1 h-full min-h-[400px]">
        <WeatherDetailsPanel
          weather={weatherData}
          imageUrl={locationImageUrl}
          isFetchingImage={isFetchingImage}
          isFetchingWeather={isFetchingWeather}
        />
      </div>
    </div>
  );
}
