# Netlify Deployment Guide

This project is optimized for Netlify deployment with the following configurations:

## Optimizations Applied

### 1. **Routing Configuration**
- `netlify.toml` - Main configuration with build settings and SPA redirects
- `public/_redirects` - Backup redirect configuration

### 2. **Performance Optimizations**
- **Lazy Loading**: All route components load on-demand
- **Code Splitting**: Vendor libraries split into separate chunks:
  - `vendor.js` - React core libraries
  - `ui.js` - Radix UI components
  - `supabase.js` - Supabase client
- **Caching**: Assets cached for 1 year with immutable headers
- **Security Headers**: Added security headers for production

### 3. **Build Configuration**
- Disabled source maps for smaller bundle size
- Optimized chunk size warnings
- SWC for faster compilation

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Optimize for Netlify deployment"
git push
```

### 2. Deploy to Netlify

#### Option A: Via Netlify UI
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Build settings are auto-detected from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables (see below)
6. Click "Deploy"

#### Option B: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 3. Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

**Important**: These are the same values from your `.env` file.

### 4. Custom Domain (Optional)
1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS records as instructed

## Post-Deployment Checklist

- ✅ Site loads correctly
- ✅ All routes work (test `/admin` and 404 page)
- ✅ Supabase connection works
- ✅ Contact form submits successfully
- ✅ Admin login works
- ✅ Images and assets load properly
- ✅ Social media links work

## Performance Tips

1. **Image Optimization**: Images are already optimized but consider using WebP format
2. **Lazy Loading**: Implemented for all routes
3. **Bundle Analysis**: Run `npm run build` and check bundle sizes
4. **CDN**: Netlify automatically uses their global CDN

## Troubleshooting

### Build Fails
- Check Node version (using v18 as specified in `netlify.toml`)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

### Routes Return 404
- Verify `_redirects` file exists in `public/` folder
- Check `netlify.toml` redirect configuration

### Environment Variables Not Working
- Ensure variable names start with `VITE_`
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

### Slow Load Times
- Check Network tab in browser DevTools
- Verify assets are being cached properly
- Consider enabling Netlify's asset optimization

## Monitoring

- **Netlify Analytics**: Enable in site settings for traffic insights
- **Deploy Logs**: Check for build warnings or errors
- **Function Logs**: Monitor if using Netlify Functions

## Support

For issues specific to:
- **Netlify**: [Netlify Support](https://www.netlify.com/support/)
- **Build Problems**: Check build logs in Netlify dashboard
- **Supabase**: [Supabase Docs](https://supabase.io/docs)
