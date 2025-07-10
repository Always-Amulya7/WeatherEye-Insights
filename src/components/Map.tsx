"use client";
import React, { useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { AlertTriangle } from "lucide-react";
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};
interface MapProps {
  locations: { lat: number; lng: number }[];
  isLoaded: boolean;
  loadError?: Error;
}
export default function Map({ locations, isLoaded, loadError }: MapProps) {
  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      if (locations.length === 0) return;
      if (locations.length === 1) {
        map.setCenter(locations[0]);
        map.setZoom(7);
        return;
      }
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((loc) => {
        bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng));
      });
      map.fitBounds(bounds);
    },
    [locations]
  );
  if (loadError) {
    return (
      <Card className="bg-destructive/20 border-destructive text-destructive-foreground p-4 flex items-center gap-4">
        <AlertTriangle className="w-8 h-8" />
        <div>
          <p className="font-bold">Map Error</p>
          <p className="text-sm">
            Could not load Google Maps. Please check your API key and ensure the
            'Maps JavaScript API' is enabled in your Google Cloud project.
          </p>
        </div>
      </Card>
    );
  }
  if (!isLoaded) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border">
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {locations.map((loc, i) => (
          <Marker key={i} position={loc} />
        ))}
      </GoogleMap>
    </div>
  );
}
