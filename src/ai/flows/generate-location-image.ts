"use server";
/**
 * @fileOverview Generates an image for a given location.
 *
 * - generateLocationImage - A function that handles the location image generation.
 * - GenerateLocationImageInput - The input type for the generateLocationImage function.
 * - GenerateLocationImageOutput - The return type for the generateLocationImage function.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
const GenerateLocationImageInputSchema = z.object({
  locationName: z
    .string()
    .describe(
      "The name of the location, e.g., 'Paris, France' or 'a beach in the Maldives'."
    ),
});
export type GenerateLocationImageInput = z.infer<
  typeof GenerateLocationImageInputSchema
>;
const GenerateLocationImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI."),
});
export type GenerateLocationImageOutput = z.infer<
  typeof GenerateLocationImageOutputSchema
>;
export async function generateLocationImage(
  input: GenerateLocationImageInput
): Promise<GenerateLocationImageOutput> {
  return generateLocationImageFlow(input);
}
const generateLocationImageFlow = ai.defineFlow(
  {
    name: "generateLocationImageFlow",
    inputSchema: GenerateLocationImageInputSchema,
    outputSchema: GenerateLocationImageOutputSchema,
  },
  async (input) => {
    const prompt = `A beautiful, scenic photograph of ${input.locationName}. Hyperrealistic photo.`;
    const { media } = await ai.generate({
      model: "googleai/gemini-3.1-flash-image-preview",
      prompt: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });
    if (!media?.url) {
      throw new Error("Image generation failed.");
    }
    return { imageDataUri: media.url };
  }
);
