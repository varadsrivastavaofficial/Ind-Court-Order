
# IndCourtOrder AI

A Next.js application to generate realistic judicial-style legal notices using AI.

## Deployment on Vercel

1. **Push to GitHub**: Sync your local repository with GitHub.
2. **Connect to Vercel**: Import the GitHub repository into Vercel.
3. **Set Environment Variables**: In the Vercel dashboard, go to **Settings > Environment Variables** and add:
   - `GEMINI_API_KEY`: Your API key from [Google AI Studio](https://aistudio.google.com/).
4. **Deploy**: Vercel will automatically build and deploy your application.

## Local Development

1. Create a `.env` file in the root directory.
2. Add your `GEMINI_API_KEY=your_actual_key_here`.
3. Run `npm run dev`.
