
'use server';
/**
 * @fileOverview A flow to generate a judicial-style court order or legal notice.
 *
 * - generateCourtOrder - A function that handles the generation process.
 * - GenerateCourtOrderInput - The input type for the function.
 * - GenerateCourtOrderOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCourtOrderInputSchema = z.object({
  targetName: z.string(),
  location: z.string(),
  grievanceType: z.string(),
  incidentDescription: z.string(),
});
export type GenerateCourtOrderInput = z.infer<typeof GenerateCourtOrderInputSchema>;

const GenerateCourtOrderOutputSchema = z.object({
  subject: z.string().describe('The subject line of the legal notice.'),
  body: z.string().describe('The main body of the notice. It should be cold, harsh, authoritative, and judicial.'),
  ipcSections: z.array(z.string()).describe('List of relevant IPC (Indian Penal Code) sections with brief descriptions.'),
});
export type GenerateCourtOrderOutput = z.infer<typeof GenerateCourtOrderOutputSchema>;

const generateCourtOrderPrompt = ai.definePrompt({
  name: 'generateCourtOrderPrompt',
  input: { schema: GenerateCourtOrderInputSchema },
  output: { schema: GenerateCourtOrderOutputSchema },
  prompt: `You are the Registrar General of the High Court of Judicature at Allahabad. 

Generate a formal legal notice based on the following grievance:
Target: {{{targetName}}}
Location: {{{location}}}
Type: {{{grievanceType}}}
Description: {{{incidentDescription}}}

Tone Requirements:
1. Extremely formal, cold, and harsh.
2. Use complex legal vocabulary typical of Indian judicial documents.
3. Establish absolute authority.
4. The body should sound like a final warning before severe legal repercussions.

Format:
- Subject: A concise legal subject line.
- Body: A detailed account of the violation and a directive for compliance.
- IPC Sections: Identify at least 3 relevant sections of the Indian Penal Code that could apply to this specific incident description.`,
});

export async function generateCourtOrder(input: GenerateCourtOrderInput): Promise<GenerateCourtOrderOutput> {
  const { output } = await generateCourtOrderPrompt(input);
  if (!output) throw new Error('Failed to generate document. Please ensure your GEMINI_API_KEY is configured correctly.');
  return output;
}
