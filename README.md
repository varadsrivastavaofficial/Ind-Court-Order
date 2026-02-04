
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
4. **Redeploy**: Go to the **Deployments** tab in Vercel, click the three dots on your latest deployment, and select **Redeploy** to apply the new API key.

## Local Development

1. Create a `.env` file in the root directory.
2. Add your `GEMINI_API_KEY=your_actual_key_here`.
3. Run `npm run dev`.
