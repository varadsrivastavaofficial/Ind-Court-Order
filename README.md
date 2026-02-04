
# IndCourtOrder AI

A Next.js application to generate realistic judicial-style legal notices using AI.

## Deployment on Vercel

1. **Push to GitHub**: Sync your local repository with GitHub using the "Sync Changes" button.
2. **Connect to Vercel**: Import the GitHub repository into Vercel.
3. **Set Environment Variables**: 
   - In the Vercel dashboard, go to **Settings > Environment Variables**.
   - Add a new variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: [Get your key here](https://aistudio.google.com/)
   - Click **Save**.
4. **CRITICAL STEP: Redeploy**: 
   - Environment variables are only applied during the build process.
   - Go to the **Deployments** tab in Vercel.
   - Find your latest deployment, click the three dots (**...**), and select **Redeploy**.
   - **Do not skip this step**, or you will continue to see `API_KEY_MISSING`.

## Local Development

1. Create a `.env` file in the root directory.
2. Add your `GEMINI_API_KEY=your_actual_key_here`.
3. Run `npm run dev`.
