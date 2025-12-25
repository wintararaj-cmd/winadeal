# 🔧 Route Not Found - Troubleshooting Guide

**Issue**: Getting "Route not found" error  
**Date**: December 23, 2024

---

## 🎯 **Quick Fix**

### **Check Which Route is Failing**

The error could be on:
1. **Customer Web App** (http://localhost:3001)
2. **Backend API** (http://localhost:5000)

---

## ✅ **Backend API Routes**

### **Correct Route Paths:**

```
Authentication:
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/verify-otp
POST http://localhost:5000/api/auth/refresh
POST http://localhost:5000/api/auth/logout

Shops:
GET  http://localhost:5000/api/shops
GET  http://localhost:5000/api/shops/:id
GET  http://localhost:5000/api/shops/:id/products

Products:
GET  http://localhost:5000/api/products
GET  http://localhost:5000/api/products/:id

Categories:
GET  http://localhost:5000/api/categories
GET  http://localhost:5000/api/categories/:id
```

**Note**: Routes use `/api/` NOT `/api/v1/`

---

## 🧪 **Test Backend Routes**

### **1. Test Health Check**
```bash
curl http://localhost:5000/health
```
**Expected**: `{"status":"OK",...}`

### **2. Test Shops Route**
```bash
curl http://localhost:5000/api/shops
```
**Expected**: JSON with shops array

### **3. Test Categories Route**
```bash
curl http://localhost:5000/api/categories
```
**Expected**: JSON with categories array

---

## 🌐 **Customer Web App Routes**

### **Frontend Routes:**
```
http://localhost:3001/          - Home page
http://localhost:3001/shops     - Shops listing
http://localhost:3001/shops/:id - Shop detail (not built yet)
http://localhost:3001/cart      - Cart (not built yet)
http://localhost:3001/login     - Login (not built yet)
```

---

## 🔍 **Common Issues & Fixes**

### **Issue 1: Backend Route 404**

**Symptom**: `curl http://localhost:5000/api/shops` returns 404

**Fix**: Check if backend server restarted properly
```bash
# Stop backend (Ctrl+C in terminal)
cd backend
npm run dev
```

### **Issue 2: Customer Web 404**

**Symptom**: Clicking links shows "Route not found"

**Fix**: Some routes aren't built yet. Only these work:
- `/` (Home)
- `/shops` (Shops listing)

### **Issue 3: CORS Error**

**Symptom**: Browser console shows CORS error

**Fix**: Backend CORS is already configured for localhost:3001

### **Issue 4: TypeScript Errors**

**Symptom**: Customer web app shows blank page

**Fix**: Check browser console for errors
```bash
# Restart customer web
cd customer-web
npm run dev
```

---

## 🛠️ **Quick Diagnostic**

### **1. Check All Services Running**
```bash
# Should see 3 processes
netstat -ano | findstr "5000 5173 3001"
```

### **2. Check Backend Logs**
Look at the backend terminal for errors

### **3. Check Browser Console**
Open DevTools (F12) and check Console tab

---

## ✅ **Working Routes to Test**

### **Backend (100% Working)**
```bash
# Health check
curl http://localhost:5000/health

# Get shops
curl http://localhost:5000/api/shops

# Get categories
curl http://localhost:5000/api/categories

# Get products
curl http://localhost:5000/api/products
```

### **Customer Web (70% Working)**
```
✅ http://localhost:3001/          - Home page
✅ http://localhost:3001/shops     - Shops listing
❌ http://localhost:3001/shops/123 - Not built yet
❌ http://localhost:3001/cart      - Not built yet
❌ http://localhost:3001/login     - Not built yet
```

---

## 📝 **What to Check**

1. **Which URL are you accessing?**
   - If it's a customer web route, check if that page is built
   - If it's a backend API, check the correct path

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Check Backend Terminal**
   - Look for TypeScript errors
   - Check if routes are registered

---

## 🎯 **Most Likely Cause**

You're probably trying to access a customer web route that hasn't been built yet:

**Built Pages:**
- ✅ Home (`/`)
- ✅ Shops (`/shops`)

**Not Built Yet:**
- ❌ Shop Detail (`/shops/:id`)
- ❌ Cart (`/cart`)
- ❌ Login (`/login`)
- ❌ Orders (`/orders`)
- ❌ Profile (`/profile`)

---

## 💡 **Solution**

### **If you're on Customer Web:**
Stick to these routes for now:
- `http://localhost:3001/` - Home
- `http://localhost:3001/shops` - Shops

### **If you're testing Backend:**
Use the correct API paths:
- `http://localhost:5000/api/shops`
- `http://localhost:5000/api/categories`
- `http://localhost:5000/api/products`

---

## 🆘 **Still Having Issues?**

Please provide:
1. **Which URL** you're trying to access
2. **Error message** (exact text or screenshot)
3. **Browser console** errors (F12 → Console tab)

---

**Quick Test**: Try these URLs to confirm everything works:
```
✅ http://localhost:3001/
✅ http://localhost:3001/shops
✅ http://localhost:5000/health
✅ http://localhost:5000/api/shops
```

If these work, your setup is fine! Just avoid unbuilt routes.
