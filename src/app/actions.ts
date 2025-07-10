"use server";
import { identifyCloudClusters } from "@/ai/flows/cloud-cluster-identifier";
import { summarizeSatelliteData } from "@/ai/flows/summarize-satellite-data";
import { getWeatherForecast } from "@/ai/flows/get-weather-forecast";
import { correlateCloudData } from "@/ai/flows/correlate-cloud-data";
import { generateLocationImage } from "@/ai/flows/generate-location-image";
import type { GetWeatherForecastOutput } from "@/ai/flows/get-weather-forecast";
import type { CorrelateCloudDataOutput } from "@/ai/flows/correlate-cloud-data";
import type {
  ClusterAnalysisResult,
  SatelliteSummaryResult,
} from "@/lib/types";
import type { GenerateLocationImageOutput } from "@/ai/flows/generate-location-image";
export async function analyzeCloudImage(
  photoDataUri: string
): Promise<ClusterAnalysisResult | { error: string }> {
  try {
    if (!photoDataUri.startsWith("data:image")) {
      return { error: "Invalid image data URI." };
    }
    const result = await identifyCloudClusters({ photoDataUri });
    return result.clusterAnalysis;
  } catch (e) {
    console.error("Error in analyzeCloudImage:", e);
    return {
      error: "Failed to analyze cloud image. Please try a different image.",
    };
  }
}
export async function getSatelliteSummary(
  satelliteData: string
): Promise<SatelliteSummaryResult | { error: string }> {
  try {
    const result = await summarizeSatelliteData({ satelliteData });
    return result;
  } catch (e) {
    console.error("Error in getSatelliteSummary:", e);
    return { error: "Failed to generate satellite summary." };
  }
}
export async function getForecastForLocation(
  location: string
): Promise<GetWeatherForecastOutput | { error: string }> {
  try {
    const result = await getWeatherForecast({ location });
    return result;
  } catch (e) {
    console.error("Error in getForecastForLocation:", e);
    return { error: "Failed to fetch weather forecast." };
  }
}
export async function getCloudCorrelation(
  photoDataUri: string,
  clusterAnalysis: string
): Promise<CorrelateCloudDataOutput | { error: string }> {
  try {
    const result = await correlateCloudData({ photoDataUri, clusterAnalysis });
    return result;
  } catch (e) {
    console.error("Error in getCloudCorrelation:", e);
    return { error: "Failed to generate correlation data." };
  }
}
export async function getLocationImage(
  locationName: string
): Promise<GenerateLocationImageOutput | { error: string }> {
  try {
    const result = await generateLocationImage({ locationName });
    return result;
  } catch (e) {
    console.error("Error in getLocationImage:", e);
    return { error: "Failed to generate location image." };
  }
}
