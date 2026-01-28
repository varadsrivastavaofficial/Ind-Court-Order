'use server';

/**
 * @fileOverview Suggests possible Grievance Types based on the Incident Description.
 *
 * - suggestGrievanceTypes - A function that suggests grievance types based on the incident description.
 * - SuggestGrievanceTypesInput - The input type for the suggestGrievanceTypes function.
 * - SuggestGrievanceTypesOutput - The return type for the suggestGrievanceTypes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGrievanceTypesInputSchema = z.object({
  incidentDescription: z
    .string()
    .describe('The description of the incident provided by the user.'),
});
export type SuggestGrievanceTypesInput = z.infer<typeof SuggestGrievanceTypesInputSchema>;

const SuggestGrievanceTypesOutputSchema = z.object({
  suggestedGrievanceTypes: z
    .array(z.string())
    .describe('An array of suggested grievance types based on the incident description.'),
});
export type SuggestGrievanceTypesOutput = z.infer<typeof SuggestGrievanceTypesOutputSchema>;

export async function suggestGrievanceTypes(
  input: SuggestGrievanceTypesInput
): Promise<SuggestGrievanceTypesOutput> {
  return suggestGrievanceTypesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGrievanceTypesPrompt',
  input: {schema: SuggestGrievanceTypesInputSchema},
  output: {schema: SuggestGrievanceTypesOutputSchema},
  prompt: `Based on the following incident description, suggest a few relevant grievance types:
  Incident Description: {{{incidentDescription}}}
  
  Grievance Types should be a JSON array of strings. e.g. ["Noise", "Harassment", "Property", "Nuisance", "Other"].  It should only contain grievance types that are relevant to the incident description.
  Do not add any intro or conclusion. Return ONLY the JSON array.`,
});

const suggestGrievanceTypesFlow = ai.defineFlow(
  {
    name: 'suggestGrievanceTypesFlow',
    inputSchema: SuggestGrievanceTypesInputSchema,
    outputSchema: SuggestGrievanceTypesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
