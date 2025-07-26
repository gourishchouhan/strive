# Deployment Guide for Strive

## Quick Start (Development)

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Update `.env.local` with your MongoDB connection string.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Seed Sample Data (Optional)**
   ```bash
   npm run seed
   ```

## Production Deployment on Vercel

### Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas cluster (or local MongoDB for development)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Strive app"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NEXT_PUBLIC_APP_URL`: Your deployed app URL
     - `NODE_ENV`: production

3. **MongoDB Atlas Setup**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Add database user
   - Whitelist IP addresses (use 0.0.0.0/0 for all IPs)
   - Get connection string and update `MONGODB_URI`

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strive?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Database Setup

The application will automatically create the required collections when you first use the features:
- `challenges` - Challenge data
- `tasks` - Daily tasks and schedule
- `achievements` - Achievement progress (auto-generated)

### Post-Deployment

1. **Test the deployment**
   - Visit your deployed URL
   - Create a challenge
   - Add some tasks
   - Check progress and achievements

2. **Optional: Seed data**
   You can run the seed script locally to populate test data:
   ```bash
   MONGODB_URI="your-production-uri" npm run seed
   ```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify connection string format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

2. **Build Errors**
   - Run `npm install --legacy-peer-deps` to resolve dependency conflicts
   - Check that all environment variables are set

3. **API Routes Not Working**
   - Verify MongoDB connection
   - Check console for specific error messages
   - Ensure all required environment variables are set

### Support

For additional help:
1. Check the application logs in Vercel dashboard
2. Review MongoDB Atlas logs
3. Open an issue in the GitHub repository

## Features Overview

Once deployed, users can:
- Create and manage self-improvement challenges
- Schedule daily tasks with priorities
- Track progress with visual analytics
- Unlock achievements for reaching milestones
- View comprehensive progress reports

The application is fully responsive and works great on mobile devices!
