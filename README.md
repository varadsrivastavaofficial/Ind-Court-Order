
# IndCourtOrder AI

A Next.js application to generate realistic judicial-style legal notices using AI.

## Deployment on Vercel

1. **Push to GitHub**: Sync your local repository with GitHub.
2. **Connect to Vercel**: Import the GitHub repository into Vercel.
3. **Set Environment Variables**: 
   - In the Vercel dashboard, go to **Settings > Environment Variables**.
   - Add a new variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: [Get your key from Google AI Studio](https://aistudio.google.com/)
   - **IMPORTANT**: Ensure the "Environments" checkboxes (Production, Preview, Development) are ALL checked.
   - Click **Save**.
4. **CRITICAL STEP: Redeploy**: 
   - Environment variables are only applied during a build.
   - Go to the **Deployments** tab in Vercel.
   - Find your latest deployment, click the three dots (**...**), and select **Redeploy**.
   - Select "Redeploy" again in the confirmation modal.
   - **Do not skip this step**, or the code will not "see" the new key.

## Troubleshooting API Key Errors

If you see "API_KEY_MISSING" even after redeploying:
1. Double-check for typos in the key name (`GEMINI_API_KEY`).
2. Ensure there are no leading or trailing spaces in the value.
3. Check the **Logs** tab in Vercel to see server-side debugging information.

## Local Development

1. Create a `.env` file in the root directory.
2. Add your `GEMINI_API_KEY=your_actual_key_here`.
3. Run `npm run dev`.
