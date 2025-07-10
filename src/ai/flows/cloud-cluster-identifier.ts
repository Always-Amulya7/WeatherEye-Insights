"use server";
/**
 * @fileOverview Cloud cluster identification AI agent.
 *
 * - identifyCloudClusters - A function that handles the cloud cluster identification process.
 * - IdentifyCloudClustersInput - The input type for the identifyCloudClusters function.
 * - IdentifyCloudClustersOutput - The return type for the identifyCloudClusters function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const IdentifyCloudClustersInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of clouds, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyCloudClustersInput = z.infer<
  typeof IdentifyCloudClustersInputSchema
>;
const IdentifyCloudClustersOutputSchema = z.object({
  clusterAnalysis: z.object({
    clusterType: z.string().describe("The type of cloud cluster identified."),
    patterns: z
      .string()
      .describe("The patterns observed in the cloud cluster."),
    confidence: z
      .number()
      .describe("The confidence level of the identification (0-1)."),
  }),
});
export type IdentifyCloudClustersOutput = z.infer<
  typeof IdentifyCloudClustersOutputSchema
>;
export async function identifyCloudClusters(
  input: IdentifyCloudClustersInput
): Promise<IdentifyCloudClustersOutput> {
  return identifyCloudClustersFlow(input);
}
const prompt = ai.definePrompt({
  name: "identifyCloudClustersPrompt",
  input: { schema: IdentifyCloudClustersInputSchema },
  output: { schema: IdentifyCloudClustersOutputSchema },
  prompt: `You are an expert meteorologist specializing in identifying and classifying cloud clusters.

You will analyze the provided cloud image and identify the cloud cluster type and any discernible patterns.

Based on your analysis, provide the cloud cluster type, a description of the observed patterns, and a confidence level for your identification.

Image: {{media url=photoDataUri}}`,
});
const identifyCloudClustersFlow = ai.defineFlow(
  {
    name: "identifyCloudClustersFlow",
    inputSchema: IdentifyCloudClustersInputSchema,
    outputSchema: IdentifyCloudClustersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
