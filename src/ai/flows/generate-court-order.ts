'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CourtOrderInputSchema = z.object({
  targetName: z.string().describe('The name of the person or entity the grievance is against.'),
  location: z.string().describe('The location where the incident occurred.'),
  grievanceType: z.string().describe('The category of the grievance.'),
  incidentDescription: z.string().describe('A detailed description of the incident.'),
});

export type CourtOrderInput = z.infer<typeof CourtOrderInputSchema>;

const CourtOrderOutputSchema = z.object({
  subject: z.string().describe('The subject line for the legal document.'),
  body: z.string().describe('The main body of the legal text, written in a cold, harsh, and authoritative tone.'),
  ipcSections: z.array(z.string()).describe('A list of relevant Indian Penal Code (IPC) sections that apply to the grievance.'),
});

export type CourtOrderOutput = z.infer<typeof CourtOrderOutputSchema>;


const courtOrderPrompt = ai.definePrompt({
    name: 'courtOrderPrompt',
    input: { schema: CourtOrderInputSchema },
    output: { schema: CourtOrderOutputSchema },
    prompt: `You are a legal assistant for a judge in the High Court of Allahabad, India. Your task is to draft a formal legal notice based on a grievance. The tone must be cold, harsh, and authoritative. Do not use any salutations like "Dear Sir/Madam" or closings like "Yours faithfully".

The draft should include:
1. A 'Subject' line.
2. A 'Body' that details the grievance and warns of potential legal action.
3. A list of relevant 'IPC Sections' (Indian Penal Code) that may apply.

Generate only the content for the legal notice.

Grievance Details:
- Accused Person/Entity: {{{targetName}}}
- Location of Incident: {{{location}}}
- Type of Grievance: {{{grievanceType}}}
- Description of Incident: {{{incidentDescription}}}
`,
});


const generateCourtOrderFlow = ai.defineFlow(
  {
    name: 'generateCourtOrderFlow',
    inputSchema: CourtOrderInputSchema,
    outputSchema: CourtOrderOutputSchema,
  },
  async (input) => {
    const llmResponse = await courtOrderPrompt(input);
    const output = llmResponse.output;

    if (!output) {
      throw new Error('Failed to generate court order from AI.');
    }
    
    return output;
  }
);


export async function generateCourtOrder(input: CourtOrderInput): Promise<CourtOrderOutput> {
    return generateCourtOrderFlow(input);
}
