"use server";
/**
 * @fileOverview Generates a 7-day weather forecast for a given location.
 *
 * - getWeatherForecast - A function that returns a 7-day weather forecast.
 * - GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * - GetWeatherForecastOutput - The return type for the getWeatherForecast function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const ApiWeatherDataSchema = z.object({
  date: z
    .string()
    .describe(
      "The date for the forecast, e.g., 'Today', 'Tomorrow', 'In 2 days'."
    ),
  dayOfWeek: z
    .string()
    .describe("The day of the week for the forecast, e.g., 'Mon', 'Tue'."),
  temp: z.number().describe("The temperature in Celsius."),
  condition: z
    .string()
    .describe('The weather condition, e.g., "Sunny", "Cloudy".'),
  icon: z
    .enum(["Sun", "Cloudy", "Cloud", "CloudRain", "Zap", "Tornado"])
    .describe("The name of the icon representing the weather condition."),
  humidity: z.number().describe("The humidity percentage."),
  precipitation: z.number().describe("The precipitation percentage."),
  windSpeed: z.number().describe("The wind speed in km/h."),
  cloudOvercast: z
    .string()
    .describe('The cloud overcast percentage as a string, e.g., "15%".'),
  cycloneType: z
    .string()
    .optional()
    .describe(
      'The type of cyclone if any, e.g., "Tropical Storm", "Category 1".'
    ),
});
export type ApiWeatherData = z.infer<typeof ApiWeatherDataSchema>;
const GetWeatherForecastInputSchema = z.object({
  location: z
    .string()
    .describe("The location for which to generate the weather forecast."),
});
export type GetWeatherForecastInput = z.infer<
  typeof GetWeatherForecastInputSchema
>;
const GetWeatherForecastOutputSchema = z.object({
  forecast: z
    .array(ApiWeatherDataSchema)
    .length(7)
    .describe("An array of 7 weather data objects for the 7-day forecast."),
});
export type GetWeatherForecastOutput = z.infer<
  typeof GetWeatherForecastOutputSchema
>;
export async function getWeatherForecast(
  input: GetWeatherForecastInput
): Promise<GetWeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}
const prompt = ai.definePrompt({
  name: "getWeatherForecastPrompt",
  input: { schema: GetWeatherForecastInputSchema },
  output: { schema: GetWeatherForecastOutputSchema },
  prompt: `You are a weather forecasting AI. Generate a realistic 7-day weather forecast for the following location: {{{location}}}.

  Provide a 7-day forecast starting from "Today". For each day, provide the day of the week, temperature in Celsius, weather condition, a suitable icon name from the allowed list, humidity percentage, precipitation percentage, wind speed in km/h, and cloud overcast percentage.

  If the location is prone to tropical storms (e.g., Bay of Bengal, Caribbean Sea), include a cyclone warning in the forecast for at least one or two days, with increasing intensity. For other locations, you can omit the cycloneType.

  Ensure the output is a JSON object matching the provided schema. The forecast array must contain exactly 7 days. The days should progress chronologically starting with "Today", then "Tomorrow", then "In 2 days", etc. The day of the week should be correct.`,
});
const getWeatherForecastFlow = ai.defineFlow(
  {
    name: "getWeatherForecastFlow",
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
