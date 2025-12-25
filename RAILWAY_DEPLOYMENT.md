# Railway Deployment Guide - WinADeal

## Prerequisites
- GitHub account with WinADeal repository
- Railway account (sign up at https://railway.app)
- All code pushed to GitHub

## Deployment Architecture

```
Railway Project: WinADeal
├── Backend API (Node.js)
├── PostgreSQL Database
├── Admin Panel (Static)
├── Vendor Panel (Static)
├── Customer Web (Static)
└── Delivery Web (Static)
```

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `chandratararaj-ctrl/WinADeal`
5. Railway will create a new project

### 2. Deploy PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will provision a PostgreSQL database
4. **Copy the connection details** (you'll need these)

### 3. Deploy Backend API

1. Click "+ New" → "GitHub Repo"
2. Select your WinADeal repository
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm run start`

4. Add Environment Variables:
   - Click on the backend service
   - Go to "Variables" tab
   - Add the following:

```env
NODE_ENV=production
PORT=5000

# Database (from PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OTP
OTP_EXPIRES_IN=10

# CORS (will update after frontend deployment)
CORS_ORIGIN=*
```

5. **Generate Domain**:
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the domain (e.g., `winadeal-backend.up.railway.app`)

### 4. Run Database Migrations

1. In backend service, go to "Settings"
2. Add a **Deploy Command**:
   ```bash
   npx prisma migrate deploy
   ```
   OR use:
   ```bash
   npx prisma db push
   ```

### 5. Deploy Frontend Apps

For each frontend (Admin, Vendor, Customer, Delivery):

#### A. Update Environment Variables Locally

**admin-panel/.env.production**:
```env
VITE_API_URL=https://your-backend-domain.up.railway.app/api/v1
```

**vendor-panel/.env.production**:
```env
VITE_API_URL=https://your-backend-domain.up.railway.app/api/v1
```

**customer-web/.env.production**:
```env
VITE_API_URL=https://your-backend-domain.up.railway.app/api/v1
```

**delivery-web/.env.production**:
```env
VITE_API_URL=https://your-backend-domain.up.railway.app/api/v1
```

#### B. Deploy Each Frontend

For each frontend app:

1. Click "+ New" → "GitHub Repo"
2. Select WinADeal repository
3. Configure:
   - **Root Directory**: `admin-panel` (or respective folder)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -p $PORT`

4. Add Environment Variable:
   ```env
   VITE_API_URL=https://your-backend-domain.up.railway.app/api/v1
   ```

5. Generate Domain for each service

### 6. Update CORS in Backend

After all frontends are deployed:

1. Go to backend service → Variables
2. Update `CORS_ORIGIN`:
   ```env
   CORS_ORIGIN=https://admin.railway.app,https://vendor.railway.app,https://customer.railway.app,https://delivery.railway.app
   ```
   (Replace with your actual Railway domains)

### 7. Seed Initial Data (Optional)

1. Go to backend service
2. Click "Settings" → "Deploy"
3. Add a one-time command:
   ```bash
   npx ts-node scripts/seed.ts
   ```

## Configuration Files Needed

### backend/package.json (Update scripts)

Add production start script:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate deploy"
  }
}
```

### railway.json (Optional - for monorepo)

Create in root directory:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Post-Deployment Checklist

- [ ] PostgreSQL database is running
- [ ] Backend API is deployed and accessible
- [ ] Database migrations completed successfully
- [ ] All 4 frontend apps are deployed
- [ ] Environment variables are set correctly
- [ ] CORS is configured with all frontend domains
- [ ] Test admin login
- [ ] Test vendor registration
- [ ] Test customer browsing
- [ ] Test delivery partner login

## Testing Your Deployment

### 1. Test Backend API
```bash
curl https://your-backend.up.railway.app/api/v1/health
```

### 2. Test Admin Panel
- Open: https://your-admin.up.railway.app
- Login with: 9876543210 / 123456

### 3. Test Vendor Panel
- Open: https://your-vendor.up.railway.app
- Register new vendor or login

### 4. Test Customer Web
- Open: https://your-customer.up.railway.app
- Browse shops

### 5. Test Delivery Web
- Open: https://your-delivery.up.railway.app
- Register delivery partner

## Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: Check DATABASE_URL in backend environment variables

### Issue: "CORS error"
**Solution**: Update CORS_ORIGIN with all frontend domains

### Issue: "Prisma Client not generated"
**Solution**: Add `npx prisma generate` to build command

### Issue: "Module not found"
**Solution**: Ensure all dependencies are in package.json, not devDependencies

### Issue: "Port already in use"
**Solution**: Railway automatically assigns PORT, use `process.env.PORT`

## Cost Estimation

Railway Free Tier:
- $5 credit per month
- Enough for testing/development
- Upgrade to Hobby ($5/month) for production

Estimated Usage:
- PostgreSQL: ~$2/month
- Backend API: ~$2/month
- 4 Frontend apps: ~$1/month each
- **Total**: ~$8/month

## Custom Domains (Optional)

1. Go to service → Settings → Domains
2. Click "Custom Domain"
3. Add your domain (e.g., api.winadeal.com)
4. Update DNS records as instructed
5. Railway will provision SSL certificate

## Monitoring

Railway provides:
- **Logs**: Real-time logs for each service
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments
- **Alerts**: Set up alerts for failures

## Backup Strategy

1. **Database Backups**:
   - Railway doesn't auto-backup free tier
   - Use `pg_dump` manually
   - Or upgrade to paid plan for auto-backups

2. **Code Backups**:
   - Already on GitHub ✅
   - Railway deploys from GitHub

## Next Steps After Deployment

1. **Set up monitoring** (Sentry, LogRocket)
2. **Configure custom domains**
3. **Set up CI/CD** (auto-deploy on push)
4. **Add SSL certificates** (Railway provides free)
5. **Set up database backups**
6. **Configure environment-specific settings**
7. **Add rate limiting** for API
8. **Set up CDN** for static assets

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Your repository issues

---

**Ready to deploy?** Follow the steps above and your WinADeal platform will be live! 🚀
