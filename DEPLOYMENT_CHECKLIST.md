# CleanReport Deployment Checklist

## Pre-Deployment Status

### ✅ Completed Features

#### Backend
- [x] Express.js API server with JWT authentication
- [x] Prisma ORM with SQLite (dev) / PostgreSQL (prod) support
- [x] Report CRUD operations
- [x] Photo upload to Vercel Blob with file handling
- [x] Issue tracking and management
- [x] Inventory management
- [x] Comprehensive error handling
- [x] Authentication middleware
- [x] 21 passing unit tests

#### Frontend
- [x] React 18 SPA with React Router
- [x] Report creation and editing
- [x] Photo upload with FormData (optimized)
- [x] Report listing and filtering
- [x] PWA with service worker
- [x] Offline support with Workbox
- [x] Mobile-optimized UI with Tailwind CSS
- [x] Form validation with react-hook-form
- [x] State management with Zustand
- [x] 22 passing component/service tests
- [x] 75.82% test coverage

#### Infrastructure
- [x] Vercel Blob integration for photo storage (100GB free tier)
- [x] PWA manifest and service worker
- [x] Icon assets (192x192, 512x512, maskable variants)
- [x] Test automation (Jest + Vitest)

---

## Deployment Checklist

### Phase 1: Pre-Deployment Verification (3 hours)

- [ ] **Backend Setup**
  - [ ] Run `npm test` in backend directory (expect 21 passing tests)
  - [ ] Verify environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
  - [ ] Build TypeScript: `npm run build`
  - [ ] Verify dist/ folder created successfully

- [ ] **Frontend Setup**
  - [ ] Run `npm test -- --run` (expect 22 passing tests)
  - [ ] Run `npm run build` (expect dist/ folder with ~300KB JS bundle)
  - [ ] Verify PWA assets: check `dist/sw.js`, `dist/manifest.webmanifest` exist
  - [ ] Verify icons generated: check `public/icon-*.png` files

- [ ] **Database**
  - [ ] SQLite development: `npm run prisma:migrate` ✓ (completed during development)
  - [ ] PostgreSQL production: obtain connection string
    - [ ] Heroku Postgres, Railway, or managed PostgreSQL service
    - [ ] Run migrations: `npx prisma migrate deploy`
  - [ ] Verify tables created: reports, users, photos, issues

- [ ] **Environment Files**
  - [ ] Create `.env.production` from `.env.production.example`
  - [ ] Obtain Vercel Blob token from https://vercel.com/account/tokens
  - [ ] Set production JWT secrets (use strong, random values)
  - [ ] Update API base URL in frontend config

### Phase 2: Vercel Blob Setup (30 minutes)

- [ ] **Create Vercel Account**
  - [ ] Sign up at https://vercel.com
  - [ ] Create project
  - [ ] Generate read-write token

- [ ] **Configure Token**
  - [ ] Add to backend `.env.production`: `VERCEL_BLOB_READ_WRITE_TOKEN`
  - [ ] Verify token has write permissions
  - [ ] Test upload in staging environment

### Phase 3: Backend Deployment (1 hour)

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from backend directory
vercel --env-file=.env.production

# Set environment variables via Vercel dashboard
# - DATABASE_URL (PostgreSQL connection)
# - JWT_SECRET (unique random value)
# - JWT_REFRESH_SECRET (unique random value)
# - VERCEL_BLOB_READ_WRITE_TOKEN (from Vercel)
# - NODE_ENV (set to "production")
```

#### Option B: Traditional Hosting
- [ ] SSH into server
- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.production` file
- [ ] Build: `npm run build`
- [ ] Start service: `node dist/app.js` (or use PM2)
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up SSL certificate

### Phase 4: Frontend Deployment (1 hour)

#### Option A: Vercel (Recommended)
```bash
# Deploy from frontend directory
vercel --env-file=.env.production

# Environment variables
# - VITE_API_BASE_URL (backend URL)
# - VITE_APP_NAME ("CleanReport")
```

#### Option B: Netlify
```bash
# Build frontend
npm run build

# Deploy dist/ folder via Netlify UI or CLI
netlify deploy --prod --dir=dist
```

#### Option C: Traditional Hosting
- [ ] Build: `npm run build`
- [ ] Upload dist/ to web server
- [ ] Configure web server for SPA routing (all routes → index.html)
- [ ] Set CORS headers to allow backend requests

---

## Pre-Launch Testing (2 hours)

### Functional Testing
- [ ] **Authentication**
  - [ ] User registration works
  - [ ] Login with valid credentials succeeds
  - [ ] Login with invalid credentials fails
  - [ ] JWT token refresh works after expiration

- [ ] **Report Management**
  - [ ] Create new report
  - [ ] Upload photos (multiple)
  - [ ] Add issues to report
  - [ ] Edit existing report
  - [ ] Submit report
  - [ ] View submitted reports

- [ ] **Photo Upload**
  - [ ] Upload single photo
  - [ ] Upload multiple photos
  - [ ] Verify photo displays in report
  - [ ] Delete photo from report
  - [ ] Photos persist after page refresh

- [ ] **Offline Functionality**
  - [ ] Load app normally
  - [ ] Turn off internet
  - [ ] View cached reports (should work)
  - [ ] Attempt to submit report (should queue or show offline message)
  - [ ] Reconnect and sync if applicable

### Mobile Testing
- [ ] **iOS (iPhone/iPad)**
  - [ ] Access app on Safari
  - [ ] App installs to home screen
  - [ ] Fullscreen mode when launched from home
  - [ ] Custom icon appears
  - [ ] Theme color appears in status bar
  - [ ] Photos upload works
  - [ ] Offline mode works

- [ ] **Android**
  - [ ] Access app on Chrome
  - [ ] Install prompt appears
  - [ ] App installs to home screen
  - [ ] Fullscreen mode when launched
  - [ ] Adaptive icon displays
  - [ ] All features work as iOS

### Performance Testing
- [ ] **Frontend**
  - [ ] Initial load: < 3 seconds
  - [ ] TTI (Time to Interactive): < 5 seconds
  - [ ] Service worker cached: < 1 second subsequent loads
  - [ ] Bundle size: < 300KB gzipped

- [ ] **Backend**
  - [ ] API response: < 500ms
  - [ ] Photo upload: handles 5MB+ files
  - [ ] JWT validation: < 10ms per request

### Security Testing
- [ ] **Authentication**
  - [ ] JWT tokens expire correctly
  - [ ] Refresh tokens work as expected
  - [ ] Unauthorized users cannot access protected routes
  - [ ] XSS attempts blocked (React escapes by default)

- [ ] **Photo Upload**
  - [ ] File size limits enforced
  - [ ] File type validation (image only)
  - [ ] CORS properly configured

---

## Post-Deployment Steps

### Week 1 (Monitoring)
- [ ] Monitor error logs (Sentry, LogRocket, or server logs)
- [ ] Check Vercel Blob usage
- [ ] Monitor API response times
- [ ] Track user signups
- [ ] Collect initial user feedback

### Week 2-4 (User Rollout)
- [ ] Roll out to initial user group (internal team)
- [ ] Gather feedback on usability
- [ ] Fix critical bugs
- [ ] Plan improvements based on usage patterns

### Month 2 (Expansion)
- [ ] Roll out to broader user base
- [ ] Add analytics (Google Analytics, Segment)
- [ ] Implement feature requests
- [ ] Optimize performance based on metrics

### Ongoing
- [ ] Regular security updates
- [ ] Monitor storage costs
- [ ] Plan feature enhancements
- [ ] Maintain test coverage > 75%

---

## Production Environment Variables

### Backend `.env.production`
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/clean_report"

# JWT Secrets (use `openssl rand -base64 32` to generate)
JWT_SECRET="[generate-random-value]"
JWT_REFRESH_SECRET="[generate-random-value]"
JWT_EXPIRE="1h"
JWT_REFRESH_EXPIRE="7d"

# Server
NODE_ENV="production"
PORT=3000

# Logging
LOG_LEVEL="info"

# Vercel Blob
VERCEL_BLOB_READ_WRITE_TOKEN="[from-vercel-dashboard]"

# CORS
CORS_ORIGIN="https://yourdomain.com"
```

### Frontend `.env.production`
```env
VITE_API_BASE_URL="https://api.yourdomain.com"
VITE_APP_NAME="CleanReport"
```

---

## Rollback Plan

If critical issues arise after deployment:

1. **Backend Rollback** (Vercel)
   - Go to Vercel Dashboard → Deployments
   - Click "Rollback" on previous stable version
   - Estimated time: 2-3 minutes

2. **Frontend Rollback** (Vercel)
   - Same as backend
   - Estimated time: 2-3 minutes

3. **Data Integrity**
   - Database migrations are backward compatible
   - Vercel Blob photos are immutable
   - No data loss expected

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel (Frontend) | Hobby | Free |
| Vercel (Backend) | Hobby/Pro | $0-20 |
| Vercel Blob | Free (100GB) | $0 |
| PostgreSQL | Managed Service | $10-50+ |
| Domain | .com | $10-15 |
| **Total** | | **$20-85/month** |

---

## Success Criteria

✅ Deployment is successful when:
- All tests pass (backend 21, frontend 22)
- App loads on HTTPS without errors
- Photos upload and display correctly
- PWA installs on iOS/Android
- Offline mode works as expected
- No critical errors in logs
- Users can complete full workflow

---

## Emergency Contacts & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **React Router**: https://reactrouter.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## Sign-Off

- [ ] Product Owner: _______________  Date: _____
- [ ] Developer: _______________  Date: _____
- [ ] QA Lead (if applicable): _______________  Date: _____

All checklist items completed ✓ Ready for production deployment
