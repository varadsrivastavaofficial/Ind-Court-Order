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

const JudgeInfoSchema = z.object({
  name: z.string().describe("The full name of the judge."),
  title: z.string().describe("The judge's title, e.g., H.J.S."),
  role: z.string().describe("The judge's role, e.g., Registrar General."),
});

const GenerateLegalTextOutputSchema = z.object({
  subject: z.string().describe('A concise subject line for the legal communication.'),
  body: z.string().describe('The main body of the legal communication, written in a formal style.'),
  ipcSections: z.array(z.string()).describe('List of relevant IPC sections referenced in the legal text.'),
  judge: JudgeInfoSchema.describe("Information about the presiding judge."),
  signatureName: z.string().describe("The name to be used in the signature block, usually in the format 'F. Lastname' e.g. 'A. Garg'"),
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

const getCurrentJudgeName = ai.defineTool({
    name: 'getCurrentJudgeName',
    description: 'Gets the name and title of the current Registrar General for the High Court of Judicature at Allahabad.',
    inputSchema: z.object({}),
    outputSchema: JudgeInfoSchema,
  },
  async () => {
    // In a real application, this would fetch from a database or an API.
    // For this example, we'll return a static value.
    return {
      name: 'Ashish Garg',
      title: 'H.J.S.',
      role: 'Registrar General',
    };
  }
);


const legalTextPrompt = ai.definePrompt({
  name: 'legalTextPrompt',
  input: {schema: GenerateLegalTextInputSchema},
  output: {schema: GenerateLegalTextOutputSchema},
  tools: [determineIpcSections, getCurrentJudgeName],
  prompt: `You are a legal assistant drafting a formal communication regarding a grievance.

      Incident Details:
      - Target: {{targetName}}
      - Location: {{location}}
      - Grievance Type: {{grievanceType}}
      - Description: {{incidentDescription}}

      Tasks:
      1.  Use the 'getCurrentJudgeName' tool to get the details of the judge signing the document.
      2.  Create a concise subject line for this communication. It should start with "Regarding" or similar phrasing.
      3.  Draft the main body of the letter. It should formally state the grievance based on the incident description. Use a professional and objective tone.
      4.  Use the 'determineIpcSections' tool to find relevant IPC sections for the incident.
      5.  Incorporate the determined IPC sections naturally into the body of the letter where appropriate.
      6.  The body should be a single paragraph of about 150-250 words. Do not add salutations like "Dear Sir" or closings like "Yours faithfully".
      7.  Based on the judge's full name, create a signature name in the format 'F. Lastname' (e.g. 'A. Garg' for 'Ashish Garg').

      Generate the output in the required JSON format, including all fields from the output schema.
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
