import { config } from "dotenv";
config();
import "@/ai/flows/summarize-satellite-data.ts";
import "@/ai/flows/cloud-cluster-identifier.ts";
import "@/ai/flows/get-weather-forecast.ts";
import "@/ai/flows/correlate-cloud-data.ts";
import "@/ai/flows/generate-location-image.ts";
