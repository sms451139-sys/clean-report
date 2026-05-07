# PWA Setup and Deployment Guide

## What Has Been Completed ✓

### 1. **Vite PWA Plugin Configuration** 
- Installed `vite-plugin-pwa` package
- Configured in `frontend/vite.config.ts` with:
  - App manifest (name, description, icons, theme colors)
  - Workbox precaching for all static assets
  - NetworkFirst caching strategy for API calls (`/^https:\/\/api\./i`)
  - 5-minute cache expiration for API responses
  - Auto-update service worker registration

### 2. **PWA Meta Tags in HTML**
Updated `frontend/index.html` with:
- `apple-mobile-web-app-capable: yes` — enables iOS home screen installation
- `apple-mobile-web-app-status-bar-style: black-translucent` — native iOS look
- `apple-mobile-web-app-title` — app name on iOS home screen
- `theme-color` — browser UI color (#4f46e5 Indigo)
- `viewport-fit: cover` — notch support on iOS

### 3. **Icon Assets**
Generated 4 PNG files in `public/`:
- `icon-192.png` — standard home screen icon
- `icon-512.png` — splash screen icon
- `icon-maskable-192.png` — adaptive icon for modern Android
- `icon-maskable-512.png` — adaptive splash screen icon
- `icon.svg` — source icon (can be customized)

### 4. **Service Worker & Precaching**
Generated in production build:
- `dist/sw.js` — Service worker with Workbox
- `dist/workbox-e4022e15.js` — Workbox runtime library
- `dist/manifest.webmanifest` — Web app manifest
- `dist/registerSW.js` — Service worker registration script

---

## Testing on iOS (iPhone/iPad)

### Step 1: Access via HTTPS or localhost
1. **Local Testing**: Navigate to `http://localhost:5173` on iPhone (Safari)
   - Note: PWA features limited on localhost without HTTPS
   - For full PWA testing, use ngrok or deploy to staging

2. **Production Testing**: Use your production HTTPS URL

### Step 2: Install App on Home Screen
1. Open in Safari
2. Tap the **Share** button (square with arrow)
3. Select **"Add to Home Screen"**
4. Name the app (e.g., "CleanReport") and tap **Add**
5. App will appear on home screen with custom icon

### Step 3: Test Features
- **Offline**: Turn off WiFi/cellular, use app (should work!)
- **App Mode**: App launches fullscreen like native app
- **Status Bar**: Custom theme color appears in status bar
- **Splash Screen**: Custom icon displays during launch

---

## Testing on Android

### Step 1: Open Chrome Browser
1. Navigate to your app URL
2. For localhost: use `adb reverse tcp:5173 tcp:5173` to tunnel

### Step 2: Install App
1. Chrome shows **"Install app"** button in address bar (or menu)
2. Tap **Install** button
3. App will be installed to home screen with custom icon

### Step 3: Test Features
- **Offline**: Toggle airplane mode, app remains functional
- **App Mode**: Launches fullscreen without browser chrome
- **Adaptive Icon**: Android uses maskable icon for modern look
- **Navigation**: Back button handles navigation properly

---

## Deployment Checklist

### Before Deployment:
- [ ] Ensure `vite-plugin-pwa` is installed: `npm list vite-plugin-pwa`
- [ ] Icons are in `public/` directory and referenced in manifest
- [ ] HTTPS is enabled (required for service workers in production)
- [ ] Update `vite.config.ts` to point API calls to production URL

### Vercel Deployment:
```bash
npm run build
# Copy dist/ to Vercel
# Service worker will auto-register on user's browser
```

### Manual Server Deployment:
1. Build the app: `npm run build`
2. Serve `dist/` folder with proper CORS headers
3. Ensure all static assets are cached with appropriate headers:
```nginx
# .nginx.conf example
add_header Cache-Control "public, max-age=31536000, immutable" for /assets/*;
add_header Cache-Control "public, max-age=3600" for /index.html;
add_header Cache-Control "public, max-age=3600" for /manifest.webmanifest;
add_header Service-Worker-Allowed "/" for /sw.js;
```

---

## Offline Support Details

### What Works Offline:
- ✅ View previously loaded reports
- ✅ Browse cached images
- ✅ Form input (drafts saved locally)

### What Requires Connection:
- ❌ Creating new reports (API call needed)
- ❌ Submitting reports (API call needed)
- ❌ Real-time data updates

### Cache Behavior:
- API responses cached for **5 minutes**
- Max **50 entries** stored
- Oldest entries auto-deleted when limit reached
- User can manually clear app data in settings

---

## Customization

### Change App Colors:
1. Edit `frontend/vite.config.ts`:
   - `theme_color` in manifest (browser UI)
   - `background_color` (splash screen)

2. Edit `frontend/index.html`:
   - `<meta name="theme-color">` tag

3. Regenerate icons (replace colors in SVG):
   - Edit `public/icon.svg`
   - Run: `node generate-icons.js`

### Change App Name:
1. Edit `frontend/vite.config.ts`: 
   - `name` and `short_name` in manifest
2. Edit `frontend/index.html`:
   - `<meta name="apple-mobile-web-app-title">`

### Replace Icon:
1. Create new SVG: `public/icon.svg`
2. Run: `node generate-icons.js`

---

## Troubleshooting

### App not installing on iOS
- Ensure you're using **HTTPS** (localhost has limitations)
- Clear Safari cache and cookies
- Ensure manifest is valid JSON

### Service worker not updating
- Service workers cache aggressively
- Hard refresh (Cmd+Shift+R on macOS)
- Users can manually update via settings
- Auto-update enabled via `registerType: 'autoUpdate'`

### Icons not appearing
- Check `public/` folder for PNG files
- Verify paths in manifest.json match icon locations
- Hard refresh browser cache

### API calls failing offline (expected)
- NetworkFirst strategy tries network first, then cache
- If no cache exists, request fails (expected behavior)
- Implement offline UI feedback for users

---

## Next Steps

1. ✅ Deploy to production with HTTPS
2. ✅ Test installation on iOS and Android devices
3. ⬜ Monitor service worker updates in analytics
4. ⬜ Gather user feedback on offline experience
5. ⬜ Optimize cache size based on user behavior
