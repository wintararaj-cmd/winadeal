# Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create PostgreSQL Database

**Option A: Using Command Line**
```bash
# Windows (if PostgreSQL is installed)
psql -U postgres
CREATE DATABASE winadeal;
\q

# Or using createdb
createdb -U postgres winadeal
```

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Right-click on "Databases"
3. Create > Database
4. Name: `winadeal`
5. Click "Save"

### Step 2: Update Backend Environment

Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the DATABASE_URL:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/winadeal"
```

Replace `your_password` with your PostgreSQL password.

### Step 3: Generate Prisma Client & Run Migrations

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════╗
║        🛒 WinADeal API Server             ║
║  Status: ✅ Running                       ║
║  Port: 5000                               ║
║  URL: http://localhost:5000               ║
╚═══════════════════════════════════════════╝
```

### Step 5: Create Admin User

**Option A: Using API**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "phone": "+919876543210",
    "email": "admin@winadeal.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

Check console logs for OTP, then verify:
```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otp": "123456"
  }'
```

**Option B: Using Prisma Studio**
1. Run `npx prisma studio`
2. Open http://localhost:5555
3. Click on "User" table
4. Click "Add record"
5. Fill in:
   - role: ADMIN
   - name: Admin User
   - phone: +919876543210
   - email: admin@winadeal.com
   - passwordHash: (use bcrypt to hash "admin123")
   - isVerified: true
   - isActive: true
6. Save

### Step 6: Login to Admin Panel

1. Open http://localhost:5173
2. Login with:
   - Phone: +919876543210
   - Password: admin123
3. You'll be redirected to the dashboard!

---

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server at localhost:5432
```

**Solution**: Make sure PostgreSQL is running
```bash
# Windows
# Check if PostgreSQL service is running in Services

# Start PostgreSQL service
net start postgresql-x64-14
```

### Migration Error
```
Error: P1001: Can't reach database server
```

**Solution**: Check DATABASE_URL in .env file

### Port Already in Use
```
Error: Port 5000 is already in use
```

**Solution**: Change PORT in .env or kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Verify Setup

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "WinADeal API is running",
  "timestamp": "2024-12-22T...",
  "environment": "development"
}
```

### 2. Check Database Tables
```bash
npx prisma studio
```

You should see 15 tables:
- User
- Shop
- DeliveryPartner
- Category
- Product
- ProductVariant
- Order
- OrderItem
- Delivery
- Address
- Review
- Document
- WalletTransaction
- Coupon
- AppConfig

### 3. Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+919999999999","password":"test123","role":"CUSTOMER"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919999999999","password":"test123"}'
```

---

## Next Steps

After successful setup:
1. ✅ Backend running on port 5000
2. ✅ Admin panel running on port 5173
3. ✅ Database created with all tables
4. ✅ Admin user created
5. ✅ Login working

**You're ready to use the platform!** 🎉

---

## Seed Sample Data (Optional)

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  // Create admin
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

  // Create categories
  const foodCategory = await prisma.category.create({
    data: {
      name: 'Food',
      type: 'FOOD',
      displayOrder: 1,
      isActive: true,
    },
  });

  const groceryCategory = await prisma.category.create({
    data: {
      name: 'Grocery',
      type: 'GROCERY',
      displayOrder: 2,
      isActive: true,
    },
  });

  console.log('✅ Seed data created!');
  console.log('Admin:', admin);
  console.log('Categories:', { foodCategory, groceryCategory });
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
npx ts-node prisma/seed.ts
```

---

**Setup Complete!** 🎊
