'use server';
/**
 * @fileOverview A flow to generate a judicial-style court order or legal notice.
 * Using gemini-1.5-pro for better reliability across regions.
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

export async function generateCourtOrder(input: GenerateCourtOrderInput): Promise<{ success: boolean; data?: GenerateCourtOrderOutput; error?: string }> {
  // Check if any variant of the key exists for better debugging
  const hasKey = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY);
  
  if (!hasKey) {
    return { 
      success: false, 
      error: 'API_KEY_MISSING: The server could not find GEMINI_API_KEY. Please check Vercel Settings > Environment Variables.' 
    };
  }

  try {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      input: input,
      output: { schema: GenerateCourtOrderOutputSchema },
      config: {
        temperature: 0.7,
      },
      prompt: `You are the Registrar General of the High Court of Judicature. 

Generate a formal legal notice based on the following grievance:
Target: ${input.targetName}
Location: ${input.location}
Type: ${input.grievanceType}
Description: ${input.incidentDescription}

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

    if (!output) {
      return { success: false, error: 'AI_EMPTY_RESPONSE: The AI returned an empty response.' };
    }
    return { success: true, data: output };
  } catch (error: any) {
    console.error('[GENKIT_ERROR]', error);
    
    let errorMessage = error.message || 'An unexpected error occurred.';
    
    // Improved error mapping
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      errorMessage = 'MODEL_NOT_FOUND: Gemini 1.5 Pro could not be accessed. This might be a regional restriction or API version mismatch.';
    } else if (errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED')) {
      errorMessage = 'API_KEY_INVALID: Your Gemini API key is invalid or lacks permissions.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'QUOTA_EXHAUSTED: Gemini API rate limit reached.';
    }

    return { success: false, error: errorMessage };
  }
}
