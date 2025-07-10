// Summarize Satellite Data
"use server";
/**
 * @fileOverview Summarizes satellite data to highlight key decision points for meteorologists.
 *
 * - summarizeSatelliteData - A function that takes in satellite data and returns a summarized analysis.
 * - SummarizeSatelliteDataInput - The input type for the summarizeSatelliteData function.
 * - SummarizeSatelliteDataOutput - The return type for the summarizeSatelliteData function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const SummarizeSatelliteDataInputSchema = z.object({
  satelliteData: z.string().describe("The satellite data to be summarized."),
});
export type SummarizeSatelliteDataInput = z.infer<
  typeof SummarizeSatelliteDataInputSchema
>;
const SummarizeSatelliteDataOutputSchema = z.object({
  summary: z.string().describe("A summarized analysis of the satellite data."),
  keyDecisionPoints: z
    .array(z.string())
    .describe("Key decision points for weather forecasting."),
});
export type SummarizeSatelliteDataOutput = z.infer<
  typeof SummarizeSatelliteDataOutputSchema
>;
export async function summarizeSatelliteData(
  input: SummarizeSatelliteDataInput
): Promise<SummarizeSatelliteDataOutput> {
  return summarizeSatelliteDataFlow(input);
}
const summarizeSatelliteDataPrompt = ai.definePrompt({
  name: "summarizeSatelliteDataPrompt",
  input: { schema: SummarizeSatelliteDataInputSchema },
  output: { schema: SummarizeSatelliteDataOutputSchema },
  prompt: `You are an expert meteorologist. Please analyze the following satellite data and provide a summarized analysis, highlighting key decision points for weather forecasting.

Satellite Data:
{{{satelliteData}}}

Summary:
{{summary}}

Key Decision Points:
{{keyDecisionPoints}}`,
});
const summarizeSatelliteDataFlow = ai.defineFlow(
  {
    name: "summarizeSatelliteDataFlow",
    inputSchema: SummarizeSatelliteDataInputSchema,
    outputSchema: SummarizeSatelliteDataOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeSatelliteDataPrompt(input);
    return output!;
  }
);
