# Deployment Guide

This guide will help you deploy Recipe Finder to various platforms.

## Prerequisites

- Node.js 18+ installed
- Git installed
- An account on your chosen hosting platform

## Environment Variables

Create a `.env.local` file (or set environment variables on your hosting platform):

```env
# API Configuration (all public APIs - no keys needed!)
NEXT_PUBLIC_USE_THEMEALDB=true
NEXT_PUBLIC_USE_THE_COCKTAIL_DB=true
NEXT_PUBLIC_USE_RECIPEPUPPY=false

# Optional: Admin Token (for recipe submission)
NEXT_PUBLIC_ADMIN_TOKEN=your_admin_token_here
```

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Add environment variables if needed
7. Click "Deploy"

**Vercel automatically:**
- Builds your Next.js app
- Optimizes images
- Provides CDN
- Handles SSL certificates
- Enables automatic deployments on git push

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Click "Deploy site"

### Self-Hosting

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. The app will be available at `http://localhost:3000`

For production, use a process manager like PM2:
```bash
npm install -g pm2
pm2 start npm --name "recipe-finder" -- start
```

## Performance Optimization

The app is already optimized with:
- ✅ Image optimization (Next.js Image component)
- ✅ Code splitting and lazy loading
- ✅ React Query caching
- ✅ Compression enabled
- ✅ SWC minification
- ✅ Font optimization

## Monitoring

Consider adding:
- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Vercel Analytics, Web Vitals)

## Troubleshooting

### Build Errors

- Ensure Node.js 18+ is installed
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Image Loading Issues

- Check that image domains are whitelisted in `next.config.js`
- Verify image URLs are accessible
- Check browser console for CORS errors

### API Errors

- Verify API endpoints are accessible
- Check network connectivity
- Review API rate limits

## Support

For issues or questions, please open an issue on GitHub.

