# AI Interview Coach - Deployment Guide

This guide will walk you through getting your Google Gemini API key and deploying your application completely for **free** using Render (for the Laravel backend) and Vercel (for the Next.js frontend).

## Step 1: Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **Get API Key** in the left sidebar.
4. Click **Create API Key**.
5. Copy this key and save it somewhere safe. You will need it for the backend deployment.

## Step 2: Push Your Code to GitHub
Before deploying, both Vercel and Render need access to your code.
1. Go to [GitHub](https://github.com/) and create a new repository (e.g., `ai-interview-coach`).
2. Open your terminal in the main project folder (`/home/r/Documents/dev/ag`) and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-interview-coach.git
   git push -u origin main
   ```

## Step 3: Deploy the Backend (Render)
Render offers a free tier for web services. Since Render doesn't natively support PHP by default, we have added a `Dockerfile` to the backend folder that handles everything automatically!

1. Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`ai-interview-coach`).
4. Fill in the following settings:
   - **Name**: `ai-coach-backend` (or whatever you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Docker` *(Render will automatically select this because it sees the `Dockerfile`)*
   - **Instance Type**: Free
5. Scroll down to **Environment Variables** and click **Add Environment Variable**. Add the following:
   - `APP_ENV`: `production`
   - `APP_KEY`: `base64:kQzU9FwJ7L+YhT8xN4bV2cR1mP0oA5eD3gS6iW9uX4M=` *(This is a randomly generated key for Laravel encryption)*
   - `APP_DEBUG`: `false`
   - `DB_CONNECTION`: `sqlite`
   - `GEMINI_API_KEY`: *(Paste your Gemini API key from Step 1)*
   - `CORS_ALLOWED_ORIGINS`: `*` *(This allows your Vercel frontend to connect to the backend)*
6. Click **Create Web Service**. 
7. Once deployed, copy the **Render URL** at the top of the dashboard (e.g., `https://ai-coach-backend-xxx.onrender.com`). You will need this for the frontend.

*Note: The free tier on Render spins down after 15 minutes of inactivity, so the very first time you use the app after a break, it might take ~30 seconds to wake up. This is normal for free hosting!*

## Step 4: Deploy the Frontend (Vercel)
Vercel is the creator of Next.js and offers seamless, lightning-fast free hosting.

1. Go to [Vercel.com](https://vercel.com/) and sign up using your GitHub account.
2. Click **Add New...** -> **Project**.
3. Import your `ai-interview-coach` repository from GitHub.
4. In the **Configure Project** screen, make sure to set the following:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click `Edit` and select `frontend`.
5. Expand the **Environment Variables** section and add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://YOUR_RENDER_BACKEND_URL.onrender.com/api/v1` *(Replace with the exact URL you copied from Render in Step 3)*
6. Click **Deploy**.
7. Vercel will build and deploy your frontend. Once finished, click **Continue to Dashboard** and click on your new live domain!

## Step 5: Test the Live App
1. Open your live Vercel URL.
2. Register a new account.
3. Go to the **Briefcase** and try uploading a resume and job description.
4. The backend will now securely call the Gemini API and generate your personalized questions. Complete the interview to get your AI-evaluated report!
