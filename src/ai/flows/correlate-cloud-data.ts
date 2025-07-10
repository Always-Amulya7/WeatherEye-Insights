"use server";
/**
 * @fileOverview Correlates a cloud image with weather data for a location.
 *
 * - correlateCloudData - A function that takes a cloud image and returns hourly data.
 * - CorrelateCloudDataInput - The input type for the correlateCloudData function.
 * - CorrelateCloudDataOutput - The return type for the correlateCloudData function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const HourlyDataSchema = z.object({
  time: z
    .string()
    .describe("The time for the data point, e.g., '13:00', '13:30', '14:00'."),
  condition: z.string().describe("The weather condition at that time."),
  cloudCover: z.number().describe("Cloud cover percentage at that time."),
  precipitationChance: z
    .number()
    .describe("Chance of precipitation percentage."),
  temp: z.number().describe("The temperature in Celsius."),
  humidity: z.number().describe("The humidity percentage."),
});
const LocationPinSchema = z.object({
  lat: z.number().describe("The latitude for a plausible location."),
  lng: z.number().describe("The longitude for a plausible location."),
  description: z
    .string()
    .optional()
    .describe(
      "A brief reason why this location is plausible for the cloud formation."
    ),
});
const CorrelateCloudDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of clouds, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clusterAnalysis: z
    .string()
    .describe("The initial analysis of the cloud cluster from the image."),
});
export type CorrelateCloudDataInput = z.infer<
  typeof CorrelateCloudDataInputSchema
>;
const CorrelateCloudDataOutputSchema = z.object({
  hourlyData: z
    .array(HourlyDataSchema)
    .describe(
      "An array of half-hourly weather data points for the next 3 hours based on the cloud image."
    ),
  locationPins: z
    .array(LocationPinSchema)
    .optional()
    .describe(
      "An array of plausible map locations where such a cloud formation might occur. Omit if no locations can be determined."
    ),
});
export type CorrelateCloudDataOutput = z.infer<
  typeof CorrelateCloudDataOutputSchema
>;
export async function correlateCloudData(
  input: CorrelateCloudDataInput
): Promise<CorrelateCloudDataOutput> {
  return correlateCloudDataFlow(input);
}
const prompt = ai.definePrompt({
  name: "correlateCloudDataPrompt",
  input: { schema: CorrelateCloudDataInputSchema },
  output: { schema: CorrelateCloudDataOutputSchema },
  prompt: `You are a meteorological AI. Based on the provided cloud image and its initial analysis, generate a plausible 3-hour, half-hourly forecast. For each data point, provide the time, weather condition, cloud cover percentage, chance of precipitation percentage, temperature in Celsius, and humidity percentage.

Also, based on the cloud patterns and type from the analysis, identify several plausible locations (latitude and longitude) where such a cloud formation might occur. Provide a brief description for why each location is plausible. For example, tropical cyclones form over warm ocean waters. Cumulonimbus clouds are common in tropical regions. If you cannot determine any plausible locations, do not include the locationPins field.

Initial Analysis: {{{clusterAnalysis}}}
Image: {{media url=photoDataUri}}`,
});
const correlateCloudDataFlow = ai.defineFlow(
  {
    name: "correlateCloudDataFlow",
    inputSchema: CorrelateCloudDataInputSchema,
    outputSchema: CorrelateCloudDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
