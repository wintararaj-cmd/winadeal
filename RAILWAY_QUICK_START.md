# Railway Deployment Quick Start

## 🚀 Quick Deployment Steps

### 1. Sign Up for Railway
Visit: https://railway.app and sign up with GitHub

### 2. Create New Project
```
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: chandratararaj-ctrl/WinADeal
4. Railway will create the project
```

### 3. Add PostgreSQL Database
```
1. Click "+ New" in your project
2. Select "Database" → "PostgreSQL"
3. Wait for provisioning (30 seconds)
4. Database is ready!
```

### 4. Deploy Backend
```
1. Click "+ New" → "GitHub Repo"
2. Select WinADeal repository
3. Railway will auto-detect and deploy
```

**Configure Backend:**
- Go to backend service → Settings
- Set **Root Directory**: `backend`
- Add **Environment Variables**:
  ```
  NODE_ENV=production
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  JWT_SECRET=your-secret-key-here
  JWT_REFRESH_SECRET=your-refresh-secret-here
  CORS_ORIGIN=*
  ```

**Generate Domain:**
- Settings → Networking → Generate Domain
- Copy the URL (e.g., `winadeal-api.up.railway.app`)

### 5. Run Database Migration
```
1. Backend service → Settings
2. Under "Deploy", add:
   Build Command: npm install && npx prisma generate
   Deploy Command: npx prisma db push
```

### 6. Deploy Frontend Apps

**For each app (admin-panel, vendor-panel, customer-web, delivery-web):**

```
1. Click "+ New" → "GitHub Repo"
2. Select WinADeal
3. Configure:
   - Root Directory: admin-panel (or respective folder)
   - Build Command: npm install && npm run build
   - Start Command: npx serve -s dist -p $PORT
```

**Add Environment Variable:**
```
VITE_API_URL=https://your-backend-domain.up.railway.app/api/v1
```

**Generate Domain** for each frontend

### 7. Update CORS
```
1. Go to backend → Variables
2. Update CORS_ORIGIN with all frontend domains:
   https://admin.railway.app,https://vendor.railway.app,...
```

## ✅ Verification

### Test Backend:
```bash
curl https://your-backend.up.railway.app/api/v1/health
```

### Test Admin Panel:
Open: https://your-admin.up.railway.app

### Test Complete Flow:
1. Register vendor
2. Admin approves
3. Vendor adds products
4. Customer browses and orders

## 📊 Monitoring

Railway Dashboard shows:
- ✅ Deployment status
- ✅ Real-time logs
- ✅ Resource usage
- ✅ Build history

## 💰 Cost

**Free Tier:**
- $5 credit/month
- Perfect for testing

**Estimated Usage:**
- Database: ~$2/month
- Backend: ~$2/month
- 4 Frontends: ~$4/month
- **Total: ~$8/month**

## 🔧 Troubleshooting

**Build Failed?**
- Check logs in Railway dashboard
- Ensure package.json has all dependencies
- Verify Node version compatibility

**Database Connection Error?**
- Check DATABASE_URL is set correctly
- Ensure Prisma is generated in build step

**CORS Error?**
- Update CORS_ORIGIN with frontend domains
- Restart backend service

## 📝 Important Notes

1. **Environment Variables**: Set them BEFORE first deployment
2. **Database URL**: Railway auto-provides via `${{Postgres.DATABASE_URL}}`
3. **Domains**: Generate after deployment, then update CORS
4. **Migrations**: Use `prisma db push` for Railway (simpler than migrations)
5. **Logs**: Check Railway logs for any errors

## 🎯 Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up custom domains
3. ✅ Configure monitoring
4. ✅ Set up database backups
5. ✅ Add rate limiting
6. ✅ Configure CDN for static assets

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Your repository

---

**Estimated Time**: 30-45 minutes for complete deployment 🚀
