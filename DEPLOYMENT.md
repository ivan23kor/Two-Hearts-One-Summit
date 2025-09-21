# Vercel Deployment Guide

This PWA climbing game is now optimized for Vercel deployment with the following configurations:

## Files Created/Modified

### vercel.json
- **PWA-optimized headers**: Service worker caching, manifest caching, security headers
- **Static asset caching**: Long-term caching for immutable assets (CSS, JS, images)
- **SPA routing**: Proper rewrites for single-page application
- **Security headers**: Content security, XSS protection, frame options

### vite.config.js
- **Production optimizations**: Minification with Terser, console removal
- **Chunking strategy**: Separate chunks for Three.js and Socket.IO
- **Cache busting**: Hash-based file naming for optimal caching
- **PWA enhancements**: Service worker optimization, runtime caching

### .vercelignore
- **Deployment efficiency**: Excludes dev files, reduces upload size
- **Security**: Prevents sensitive files from being deployed

## Deployment Steps

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Or use Git integration**:
   - Push to GitHub/GitLab
   - Connect repository in Vercel dashboard
   - Auto-deploy on push

## Key Features Configured

### PWA Support
- ✅ Service worker with proper caching headers
- ✅ Manifest file with long-term caching
- ✅ Icon caching optimization
- ✅ Runtime caching for fonts and game assets

### Performance
- ✅ Asset chunking and code splitting
- ✅ Long-term caching for static assets
- ✅ Compressed builds with Terser
- ✅ Optimized chunk naming for cache busting

### Security
- ✅ Content Security Policy headers
- ✅ XSS protection
- ✅ Frame options protection
- ✅ Content type sniffing protection

### SPA Routing
- ✅ Proper fallback to index.html for client-side routing
- ✅ Service worker file accessibility

## Socket.IO Considerations

For production Socket.IO connections, ensure your backend WebSocket server:
1. Supports CORS for your Vercel domain
2. Uses secure WebSocket connections (wss://)
3. Handles connection timeouts appropriately

## Domain Configuration

Once deployed, update any Socket.IO connection URLs in your code to use the production backend endpoint.

## Performance Monitoring

- Use Vercel Analytics for performance insights
- Monitor Core Web Vitals in the Vercel dashboard
- Check PWA audit scores in Chrome DevTools