import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// We initialize without a hardcoded key here so Genkit can pick up 
// GEMINI_API_KEY or GOOGLE_GENAI_API_KEY automatically from the environment.
export const ai = genkit({
  plugins: [
    googleAI()
  ],
});
