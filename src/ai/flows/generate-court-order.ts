
'use server';
/**
 * @fileOverview A flow to generate a judicial-style court order or legal notice.
 *
 * - generateCourtOrder - A function that handles the generation process.
 * - GenerateCourtOrderInput - The input type for the function.
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
  model: 'googleai/gemini-1.5-flash',
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

export async function generateCourtOrder(input: GenerateCourtOrderInput): Promise<{ success: boolean; data?: GenerateCourtOrderOutput; error?: string }> {
  // Check for API key. Vercel env vars are accessed via process.env.
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  
  if (!apiKey) {
    console.error('[AI_ERROR] API Key is missing in process.env.');
    return { 
      success: false, 
      error: 'API_KEY_MISSING: The GEMINI_API_KEY environment variable is not found. Please add it in Vercel Project Settings > Environment Variables and REDEPLOY.' 
    };
  }

  try {
    const { output } = await generateCourtOrderPrompt(input);
    if (!output) {
      return { success: false, error: 'AI_EMPTY_RESPONSE: The AI returned an empty response.' };
    }
    return { success: true, data: output };
  } catch (error: any) {
    console.error('[GENKIT_ERROR]', error);
    
    let errorMessage = error.message || 'An unexpected error occurred during AI generation.';
    
    // Handle the specific 404 error if it persists by suggesting a different model check
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      errorMessage = 'MODEL_NOT_FOUND: The Gemini model could not be found. This might be a temporary API issue or a regional restriction. Please ensure your API key is from a supported region at aistudio.google.com.';
    } else if (errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED')) {
      errorMessage = 'API_KEY_INVALID: Your Gemini API key is invalid or lacks permissions.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'QUOTA_EXHAUSTED: Gemini API rate limit reached.';
    }

    return { success: false, error: errorMessage };
  }
}
