# Vercel Deployment Guide

This guide explains how to deploy both the React frontend and Node.js Express backend to Vercel.

## Prerequisites

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. From the project root directory, run:
   ```bash
   vercel --prod
   ```

2. Follow the prompts:
   - Link to existing project or create new one
   - Set the root directory to the current folder
   - Vercel will automatically detect the configuration from `vercel.json`

### Option 2: Deploy via Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically use the `vercel.json` configuration

## Environment Variables

Set these environment variables in your Vercel project settings:

### Required for Production:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV=production`
- `VERCEL=1`

### Optional (for AI moderation services):
- `PERSPECTIVE_API_KEY` - Google Perspective API key
- `OPENAI_API_KEY` - OpenAI API key

### Frontend Environment Variables:
- `VITE_API_BASE_URL` - Leave empty for production (API served from same domain)

## Project Structure

The deployment configuration supports this structure:
```
project/
├── frontend/          # React app (Vite)
├── backend/           # Express.js API
├── vercel.json        # Deployment configuration
└── .vercelignore      # Files to ignore during deployment
```

## How It Works

1. **Frontend**: Built as a static site using Vite and served from Vercel's CDN
2. **Backend**: Deployed as Vercel Functions (serverless)
3. **Routing**: 
   - `/api/*` routes go to the backend
   - All other routes serve the frontend

## Database Considerations

- **MongoDB**: Use MongoDB Atlas or another cloud MongoDB service
- **Connection**: The app connects to MongoDB on startup
- **Environment**: Make sure `MONGODB_URI` is set in Vercel environment variables

## Limitations

1. **Serverless Functions**: Backend runs as serverless functions with:
   - 250MB size limit
   - 30-second execution timeout (configurable)
   - Cold starts may occur

2. **WebSockets**: Socket.io may have limitations in serverless environment
   - Consider using Vercel's real-time features or external WebSocket service

3. **File Uploads**: Limited to memory-based processing
   - Consider using cloud storage for large files

## Troubleshooting

### Build Errors
- Check that all dependencies are listed in `package.json`
- Ensure environment variables are set correctly
- Review build logs in Vercel dashboard

### API Not Working
- Verify `vercel.json` routing configuration
- Check that backend exports the Express app correctly
- Ensure MongoDB connection string is valid

### Frontend Issues
- Check that `VITE_API_BASE_URL` is configured correctly
- Verify API calls use relative URLs in production

## Local Development

To test the Vercel configuration locally:
```bash
vercel dev
```

This will simulate the Vercel environment on your local machine.