# Database Schema Documentation

## Overview
WinADeal uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access.

---

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│  (Polymorphic)│
└──────┬──────┘
       │
       ├──────────┐
       │          │
       ▼          ▼
   ┌──────┐  ┌─────────────┐
   │ Shop │  │ DeliveryPartner│
   └───┬──┘  └──────┬──────┘
       │            │
       ▼            ▼
   ┌─────────┐  ┌──────────┐
   │ Product │  │ Delivery │
   └────┬────┘  └────┬─────┘
        │            │
        ▼            ▼
   ┌──────────┐  ┌───────┐
   │OrderItem │  │ Order │
   └──────────┘  └───┬───┘
                     │
                     ▼
                 ┌─────────┐
                 │ Review  │
                 └─────────┘
```

---

## Core Tables

### 1. User (Polymorphic)
**Purpose:** Stores all user types (Customer, Vendor, Delivery Partner, Admin)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| role | Enum | CUSTOMER, VENDOR, DELIVERY, ADMIN |
| name | String | Full name |
| email | String? | Email (optional, unique) |
| phone | String | Phone number (unique, required) |
| passwordHash | String? | Hashed password |
| otp | String? | Current OTP for verification |
| otpExpiresAt | DateTime? | OTP expiration time |
| isVerified | Boolean | Email/phone verification status |
| isActive | Boolean | Account active status |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `phone` (unique)
- `email` (unique)
- `role`

**Relations:**
- One-to-One: `Shop`, `DeliveryPartner`
- One-to-Many: `Address[]`, `Order[]`, `Review[]`, `WalletTransaction[]`, `Document[]`

---

### 2. Shop
**Purpose:** Vendor/restaurant/store information

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to User |
| name | String | Shop name |
| description | String? | Shop description |
| categoryId | UUID | Foreign key to Category |
| address | String | Full address |
| latitude | Float | GPS latitude |
| longitude | Float | GPS longitude |
| deliveryRadiusKm | Int | Delivery radius (default: 5) |
| avgPrepTimeMins | Int | Average preparation time |
| isOpen | Boolean | Currently open/closed |
| isVerified | Boolean | Admin verification status |
| commissionRate | Float | Platform commission % |
| rating | Float | Average rating (0-5) |
| totalOrders | Int | Total completed orders |
| gstin | String? | GST identification number |
| fssaiNumber | String? | FSSAI license (food vendors) |
| bankAccountNumber | String? | Bank account for settlements |
| bankIfscCode | String? | Bank IFSC code |
| bankAccountName | String? | Account holder name |

**Indexes:**
- `userId` (unique)
- `categoryId`
- `isVerified`
- `isOpen`

**Relations:**
- Belongs-to: `User`, `Category`
- Has-many: `Product[]`, `Order[]`

---

### 3. Product
**Purpose:** Menu items/products sold by shops

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| shopId | UUID | Foreign key to Shop |
| categoryId | UUID | Foreign key to Category |
| name | String | Product name |
| description | String? | Product description |
| price | Float | Base price |
| discountedPrice | Float? | Discounted price (if any) |
| isVeg | Boolean | Vegetarian flag |
| isAvailable | Boolean | In stock/available |
| stockQuantity | Int? | Stock count (for groceries) |
| images | String[] | Array of image URLs |

**Indexes:**
- `shopId`
- `categoryId`
- `isAvailable`

**Relations:**
- Belongs-to: `Shop`, `Category`
- Has-many: `ProductVariant[]`, `OrderItem[]`

---

### 4. Order
**Purpose:** Customer orders

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderNumber | String | Unique order number (e.g., ORD-20241222-001) |
| customerId | UUID | Foreign key to User (customer) |
| shopId | UUID | Foreign key to Shop |
| status | Enum | Order status (see OrderStatus enum) |
| deliveryAddressId | UUID | Foreign key to Address |
| subtotal | Float | Items total |
| deliveryFee | Float | Delivery charges |
| discount | Float | Discount amount |
| tax | Float | Tax amount (GST) |
| total | Float | Final total |
| paymentMethod | Enum | ONLINE, COD, WALLET |
| paymentStatus | Enum | PENDING, SUCCESS, FAILED, REFUNDED |
| paymentTransactionId | String? | Payment gateway transaction ID |
| couponCode | String? | Applied coupon code |
| specialInstructions | String? | Customer notes |
| scheduledAt | DateTime? | Scheduled delivery time |
| estimatedDeliveryAt | DateTime? | Estimated delivery time |
| prepTimeMinutes | Int? | Vendor prep time estimate |

**Indexes:**
- `orderNumber` (unique)
- `customerId`
- `shopId`
- `status`
- `createdAt`

**Relations:**
- Belongs-to: `User` (customer), `Shop`, `Address`
- Has-many: `OrderItem[]`
- Has-one: `Delivery`, `Review`

---

### 5. OrderItem
**Purpose:** Individual items in an order

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Order |
| productId | UUID | Foreign key to Product |
| quantity | Int | Quantity ordered |
| price | Float | Price at time of order |
| specialInstructions | String? | Item-specific notes |

---

### 6. Delivery
**Purpose:** Delivery assignment and tracking

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Order (unique) |
| deliveryPartnerId | UUID | Foreign key to DeliveryPartner |
| pickupTime | DateTime? | Actual pickup time |
| deliveryTime | DateTime? | Actual delivery time |
| deliveryFee | Float | Delivery fee for this order |
| tip | Float | Customer tip |
| deliveryOtp | String? | OTP for delivery verification |
| deliveryProofPhoto | String? | Photo proof URL |

---

## Enums

### UserRole
```prisma
enum UserRole {
  CUSTOMER
  VENDOR
  DELIVERY
  ADMIN
}
```

### OrderStatus
```prisma
enum OrderStatus {
  PLACED              // Order created
  ACCEPTED            // Vendor accepted
  REJECTED            // Vendor rejected
  PREPARING           // Being prepared
  READY               // Ready for pickup
  ASSIGNED            // Delivery partner assigned
  EN_ROUTE_TO_PICKUP  // Going to shop
  PICKED_UP           // Picked from shop
  OUT_FOR_DELIVERY    // On the way to customer
  DELIVERED           // Successfully delivered
  CANCELLED           // Cancelled
}
```

### PaymentMethod
```prisma
enum PaymentMethod {
  ONLINE    // UPI, Cards, Netbanking
  COD       // Cash on Delivery
  WALLET    // Platform wallet
}
```

### PaymentStatus
```prisma
enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}
```

### DocumentType
```prisma
enum DocumentType {
  GST_CERTIFICATE
  FSSAI_LICENSE
  SHOP_LICENSE
  ID_PROOF
  DRIVING_LICENSE
  VEHICLE_RC
  PHOTO
}
```

---

## Indexes Strategy

### Performance Indexes
1. **User lookups**: `phone`, `email`, `role`
2. **Shop queries**: `categoryId`, `isVerified`, `isOpen`
3. **Product searches**: `shopId`, `categoryId`, `isAvailable`
4. **Order tracking**: `orderNumber`, `customerId`, `shopId`, `status`
5. **Delivery queries**: `deliveryPartnerId`, `orderId`

### Composite Indexes (Future optimization)
```sql
CREATE INDEX idx_shop_location ON shops (latitude, longitude);
CREATE INDEX idx_order_customer_status ON orders (customerId, status);
CREATE INDEX idx_product_shop_available ON products (shopId, isAvailable);
```

---

## Data Integrity Rules

### Cascading Deletes
- Delete User → Cascade delete Shop, DeliveryPartner, Addresses, Documents
- Delete Shop → Cascade delete Products
- Delete Order → Cascade delete OrderItems, Delivery

### Constraints
1. **Phone uniqueness**: Each phone number can have only one account
2. **Order number uniqueness**: Auto-generated, guaranteed unique
3. **One shop per vendor**: User can have only one shop
4. **Rating bounds**: 0.0 to 5.0

---

## Sample Queries

### 1. Get nearby shops
```sql
SELECT * FROM shops
WHERE isOpen = true
  AND isVerified = true
  AND ST_Distance(
    ST_MakePoint(longitude, latitude),
    ST_MakePoint(?, ?)
  ) <= deliveryRadiusKm * 1000
ORDER BY rating DESC;
```

### 2. Get customer order history
```sql
SELECT o.*, s.name as shopName, d.deliveryTime
FROM orders o
JOIN shops s ON o.shopId = s.id
LEFT JOIN deliveries d ON o.id = d.orderId
WHERE o.customerId = ?
ORDER BY o.createdAt DESC;
```

### 3. Get vendor earnings
```sql
SELECT 
  DATE(createdAt) as date,
  COUNT(*) as totalOrders,
  SUM(subtotal) as grossRevenue,
  SUM(subtotal * commissionRate / 100) as platformFee,
  SUM(subtotal * (1 - commissionRate / 100)) as netEarnings
FROM orders
WHERE shopId = ? AND status = 'DELIVERED'
GROUP BY DATE(createdAt)
ORDER BY date DESC;
```

---

## Migrations

### Initial Migration
```bash
npx prisma migrate dev --name init
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Reset Database (Development only)
```bash
npx prisma migrate reset
```

---

## Backup Strategy

### Daily Backups
```bash
pg_dump -U postgres -d winadeal > backup_$(date +%Y%m%d).sql
```

### Point-in-Time Recovery
Enable WAL archiving in PostgreSQL for production.

---

**Last Updated:** December 22, 2024
