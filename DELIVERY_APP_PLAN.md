# 🚚 Delivery Partner App - Implementation Plan

## 🎯 Objective
Build a responsive web application for delivery partners to manage their deliveries, track earnings, and update order statuses.

## 🛠️ Tech Stack
- **Framework**: React + Vite (Fast & Lightweight)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile-first design)
- **State**: Zustand (Simple state management)
- **Icons**: Lucide React
- **HTTP**: Axios

---

## 📱 Core Features & User Flow

### 1. Authentication 🔐 (Step 1)
- **Login**: Phone/Password login.
- **Register**: Sign up with vehicle details (Bike/Scooter, License Plate).
- **Profile**: View profile and vehicle info.

### 2. Dashboard (Home) 🏠 (Step 2)
- **Status Toggle**: Online/Offline switch.
- **Current Task**: Prominent view of the currently assigned order.
- **New Requests**: List of orders waiting to be accepted (if we implement broadcast).
- **Assigned Orders**: List of orders assigned by vendors.

### 3. Delivery Workflow 📦 (Step 3)
- **Order Detail View**:
    - Pickup Location (Shop address + Map link).
    - Drop Location (Customer address + Map link).
    - Order Items summary.
    - Customer Contact (Call button).
- **Status Updates**:
    - **"Arrived at Shop"**
    - **"Picked Up"** (Input OTP from Shop - Optional, or just button).
    - **"Reached Delivery Location"**
    - **"Delivered"** (Input Delivery OTP provided by Customer).

### 4. Earnings & History 💰 (Step 4)
- **Earnings**: Daily/Weekly earnings summary.
- **History**: List of past completed deliveries.

---

## 📂 Project Structure (`delivery-web`)

```
src/
├── components/
│   ├── Layout.tsx          # Mobile layout with bottom nav
│   ├── OrderCard.tsx       # Reusable order card
│   ├── StatusBadge.tsx     # Status indicators
│   └── Header.tsx          # Top bar with toggle
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx       # Main view
│   ├── OrderDetail.tsx     # Actionable order view
│   ├── History.tsx         # Past orders
│   └── Profile.tsx         # User details
├── services/
│   ├── auth.service.ts
│   └── delivery.service.ts # API calls
├── store/
│   └── authStore.ts
└── App.tsx
```

---

## 📅 Implementation Steps

1.  **Setup**: Initialize `delivery-web` project & install dependencies.
2.  **Auth**: Build Login & Register pages.
3.  **Layout**: Create the mobile-friendly shell (Bottom Navigation is good for drivers).
4.  **Dashboard**: Fetch and display assigned orders.
5.  **Actions**: Build logic to update status (Pick Up -> Deliver).
6.  **OTP**: Add Delivery OTP verification modal.

---

## 🔌 API Requirements (Backend)

We need to ensure these endpoints exist (most do, might need specific tweaks):
- `POST /auth/register` (Role: DELIVERY) - *Ready*
- `POST /auth/login` (Role: DELIVERY) - *Ready*
- `GET /courier/orders/assigned` - *Need to verify/create*
- `PATCH /courier/orders/:id/status` - *Need to verify/create status transitions*
- `POST /courier/orders/:id/verify-otp` - *Need to verify/create*

Let's Build! 🚀
