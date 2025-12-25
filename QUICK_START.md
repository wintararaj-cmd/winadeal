# 🚀 Quick Start Guide - WinADeal

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js** 18+ installed ([Download](https://nodejs.org/))
- [ ] **PostgreSQL** 14+ installed ([Download](https://www.postgresql.org/download/))
- [ ] **Redis** 6+ installed ([Download](https://redis.io/download))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] Code editor (VS Code recommended)

---

## 🎯 5-Minute Setup

### Step 1: Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE winadeal;
\q
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install remaining dependencies
npm install @prisma/client socket.io redis bull
npm install -D @types/socket.io

# Create .env file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/winadeal"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════╗
║        🛒 WinADeal API Server             ║
║  Status: ✅ Running                       ║
║  Port: 5000                               ║
║  URL: http://localhost:5000               ║
╚═══════════════════════════════════════════╝
```

### Step 3: Admin Panel Setup

```bash
# Navigate to admin panel
cd ../admin-panel

# Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/postcss autoprefixer
npx tailwindcss init -p

# Install dependencies
npm install react-router-dom zustand axios
npm install recharts lucide-react date-fns
npm install react-hot-toast

# Start dev server
npm run dev
```

**Access:** http://localhost:3000

---

## 🧪 Test the Setup

### 1. Test Backend Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "WinADeal API is running",
  "timestamp": "2024-12-22T...",
  "environment": "development"
}
```

### 2. Test API Endpoints

```bash
curl http://localhost:5000/api/v1
```

### 3. Open Prisma Studio (Database GUI)

```bash
cd backend
npx prisma studio
```

**Access:** http://localhost:5555

---

## 📝 Create Your First Admin User

### Option 1: Using Prisma Studio

1. Open Prisma Studio: `npx prisma studio`
2. Go to `User` table
3. Click "Add record"
4. Fill in:
   - **role**: ADMIN
   - **name**: Admin User
   - **phone**: +919876543210
   - **email**: admin@winadeal.com
   - **passwordHash**: (generate using bcrypt)
   - **isVerified**: true
   - **isActive**: true
5. Save

### Option 2: Using SQL

```sql
-- Connect to database
psql -U postgres -d winadeal

-- Insert admin user (password: admin123)
INSERT INTO "User" (id, role, name, phone, email, "passwordHash", "isVerified", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'ADMIN',
  'Admin User',
  '+919876543210',
  'admin@winadeal.com',
  '$2a$10$YourHashedPasswordHere',
  true,
  true,
  NOW(),
  NOW()
);
```

---

## 🎨 Customize Admin Panel

### 1. Configure Tailwind

Edit `admin-panel/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
}
```

### 2. Add Tailwind to CSS

Edit `admin-panel/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🔐 Set Up Third-Party Services

### 1. Cloudinary (Image Upload)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard
3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 2. Twilio (OTP/SMS)

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a phone number
3. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### 3. Razorpay (Payments)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get test API keys
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### 4. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create API key
4. Add to `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key
   ```

### 5. Firebase (Push Notifications)

1. Create project at [firebase.google.com](https://firebase.google.com)
2. Download service account JSON
3. Add to `.env`:
   ```
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

---

## 📊 Seed Sample Data (Optional)

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const foodCategory = await prisma.category.create({
    data: {
      name: 'Food',
      type: 'FOOD',
      displayOrder: 1,
    },
  });

  const groceryCategory = await prisma.category.create({
    data: {
      name: 'Grocery',
      type: 'GROCERY',
      displayOrder: 2,
    },
  });

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      role: 'ADMIN',
      name: 'Admin User',
      phone: '+919876543210',
      email: 'admin@winadeal.com',
      passwordHash: await hashPassword('admin123'),
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npm run prisma:seed
```

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** Port 5000 already in use  
**Solution:** Change PORT in `.env` or kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Database connection error

**Problem:** Can't connect to PostgreSQL  
**Solution:** Check if PostgreSQL is running:
```bash
# Windows
pg_ctl status

# Linux/Mac
sudo systemctl status postgresql
```

### Prisma migration fails

**Problem:** Migration error  
**Solution:** Reset database (⚠️ Development only):
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Admin panel won't load

**Problem:** Blank page  
**Solution:** Check browser console for errors. Ensure backend is running.

---

## 📚 Next Steps

1. **Week 1**: Build authentication system
   - [ ] Create auth routes
   - [ ] Build login page
   - [ ] Implement JWT middleware

2. **Week 2**: Vendor management
   - [ ] Vendor registration API
   - [ ] Document upload
   - [ ] Admin verification UI

3. **Week 3**: Product management
   - [ ] Product CRUD APIs
   - [ ] Product listing UI
   - [ ] Image upload

4. **Week 4**: Order system
   - [ ] Order placement API
   - [ ] Payment integration
   - [ ] Order tracking

---

## 🎓 Learning Resources

- **Prisma**: https://www.prisma.io/docs
- **Express**: https://expressjs.com/en/guide/routing.html
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 💡 Pro Tips

1. **Use Prisma Studio** for quick database inspection
2. **Enable hot reload** in both backend and frontend
3. **Use Postman** for API testing
4. **Install React DevTools** for debugging
5. **Use Git branches** for features
6. **Write tests** as you build
7. **Document as you go**

---

## 🤝 Need Help?

- Check `PROJECT_STATUS.md` for current progress
- Review `docs/API.md` for endpoint details
- See `docs/DATABASE.md` for schema info
- Read `PROJECT_ROADMAP.md` for the plan

---

**Happy Coding! 🚀**

Let's build something amazing together!
