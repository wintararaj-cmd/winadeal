# 🔧 Login 404 Error - Quick Fix

**Issue**: Login returns 404 error  
**Cause**: Backend server may not have picked up route changes  
**Solution**: Restart backend server

---

## ✅ **Quick Fix Steps**

### **Step 1: Stop Backend**
In the backend terminal, press `Ctrl+C` to stop the server.

### **Step 2: Restart Backend**
```bash
cd backend
npm run dev
```

### **Step 3: Wait for Server**
Wait for the message:
```
✅ WinADeal API Server
Port: 5000
```

### **Step 4: Test Login**
Try logging in again at: http://localhost:3001/login

---

## 🧪 **Test Auth Endpoint**

After restarting, test the endpoint:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"phone":"+919999999999","password":"admin123"}'
```

**Expected**: JSON response with token

---

## 🔐 **Demo Credentials**

```
Phone: +919999999997
Password: customer123
```

---

## 📝 **Alternative: Check Backend Terminal**

Look for these messages in the backend terminal:
- ✅ "WinADeal API Server" - Server started
- ❌ TypeScript errors - Need to fix
- ❌ Route errors - Check imports

---

## 🆘 **If Still Not Working**

1. **Check backend terminal** for errors
2. **Verify routes** in `backend/src/server.ts`
3. **Check auth controller** exists
4. **Restart both terminals** (backend + customer-web)

---

**Quick Action**: Restart the backend server now!
