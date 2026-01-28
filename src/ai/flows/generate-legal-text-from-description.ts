'use server';

/**
 * @fileOverview Generates realistic judicial-style legal text based on an incident description, referencing relevant IPC sections.
 *
 * - generateLegalText - A function that handles the legal text generation process.
 * - GenerateLegalTextInput - The input type for the generateLegalText function.
 * - GenerateLegalTextOutput - The return type for the generateLegalText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLegalTextInputSchema = z.object({
  targetName: z.string().describe('The name of the target involved in the incident.'),
  location: z.string().describe('The location (City/State - India) where the incident occurred.'),
  grievanceType: z.enum([
    'Noise',
    'Harassment',
    'Property',
    'Nuisance',
    'Other',
  ]).describe('The type of grievance reported.'),
  incidentDescription: z.string().describe('A detailed description of the incident.'),
});
export type GenerateLegalTextInput = z.infer<typeof GenerateLegalTextInputSchema>;

const GenerateLegalTextOutputSchema = z.object({
  legalText: z.string().describe('The generated legal text mimicking a formal judicial style.'),
  ipcSections: z.array(z.string()).describe('List of relevant IPC sections referenced in the legal text.'),
});
export type GenerateLegalTextOutput = z.infer<typeof GenerateLegalTextOutputSchema>;

export async function generateLegalText(input: GenerateLegalTextInput): Promise<GenerateLegalTextOutput> {
  return generateLegalTextFlow(input);
}

const determineIpcSections = ai.defineTool({
    name: 'determineIpcSections',
    description: 'Determine the relevant IPC sections based on the incident description.',
    inputSchema: z.object({
      incidentDescription: z.string().describe('A detailed description of the incident.'),
      grievanceType: z.string().describe('The type of grievance reported.'),
    }),
    outputSchema: z.array(z.string()).describe('List of relevant IPC sections.'),
  },
  async (input) => {
    // Placeholder implementation for determining IPC sections based on the incident description and grievance type.
    // In a real application, this would involve sophisticated NLP and legal reasoning.
    // For now, return a static list of IPC sections as an example.
    console.log('determineIpcSections called with input:', input);
    if (input.grievanceType === 'Noise') {
      return ['IPC Section 268', 'IPC Section 290'];
    } else if (input.grievanceType === 'Harassment') {
      return ['IPC Section 509', 'IPC Section 354'];
    } else if (input.grievanceType === 'Property') {
      return ['IPC Section 378', 'IPC Section 420'];
    } else if (input.grievanceType === 'Nuisance') {
      return ['IPC Section 268', 'IPC Section 290'];
    } else {
      return ['IPC Section 141', 'IPC Section 144'];
    }
  }
);

const legalTextPrompt = ai.definePrompt({
  name: 'legalTextPrompt',
  input: {schema: GenerateLegalTextInputSchema},
  output: {schema: GenerateLegalTextOutputSchema},
  tools: [determineIpcSections],
  prompt: `You are a legal expert drafting a formal legal notice based on an incident report. Use a cold, judicial, and professional tone.

  The incident involves {{targetName}} at {{location}} and is classified as a {{grievanceType}} grievance.

  Incident Description: {{incidentDescription}}

  Based on the incident, determine relevant IPC sections using the determineIpcSections tool.  Reference those IPC sections in the legal notice.

  The legal text should clearly outline the grievance, reference the relevant IPC sections determined by the determineIpcSections tool, and demand immediate cessation of the offending actions.

  Do not include any conversational language or salutations. The legal text should mimic a formal court order.

  Output a legal text that is approximately 200-300 words in length.
  `,
});

const generateLegalTextFlow = ai.defineFlow(
  {
    name: 'generateLegalTextFlow',
    inputSchema: GenerateLegalTextInputSchema,
    outputSchema: GenerateLegalTextOutputSchema,
  },
  async input => {
    const {output} = await legalTextPrompt(input);
    return output!;
  }
);
