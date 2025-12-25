# WinADeal API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.winadeal.com/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Authentication

#### 1. Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "userId": "uuid",
    "phone": "+919876543210"
  }
}
```

#### 2. Verify OTP
```http
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+919876543210",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### 3. Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "phone": "+919876543210",
  "password": "securePassword123"
}
```

#### 4. Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

---

### Users

#### 1. Get Current User
```http
GET /users/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "CUSTOMER",
    "isVerified": true
  }
}
```

#### 2. Update Profile
```http
PUT /users/me
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

---

### Shops

#### 1. Get All Shops
```http
GET /shops?page=1&limit=10&category=food&search=pizza
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category ID
- `search` (optional): Search by shop name
- `isOpen` (optional): Filter by open status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pizza Palace",
      "description": "Best pizzas in town",
      "rating": 4.5,
      "deliveryRadiusKm": 5,
      "isOpen": true,
      "category": {
        "id": "uuid",
        "name": "Food"
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### 2. Get Shop Details
```http
GET /shops/:shopId
```

#### 3. Create Shop (Vendor only)
```http
POST /shops
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Restaurant",
  "description": "Delicious food",
  "categoryId": "uuid",
  "address": "123 Main St",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "deliveryRadiusKm": 5,
  "gstin": "22AAAAA0000A1Z5",
  "fssaiNumber": "12345678901234"
}
```

---

### Products

#### 1. Get Products by Shop
```http
GET /products?shopId=uuid&page=1&limit=20
```

#### 2. Get Product Details
```http
GET /products/:productId
```

#### 3. Create Product (Vendor only)
```http
POST /products
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shopId": "uuid",
  "categoryId": "uuid",
  "name": "Margherita Pizza",
  "description": "Classic cheese pizza",
  "price": 299,
  "discountedPrice": 249,
  "isVeg": true,
  "images": ["url1", "url2"]
}
```

---

### Orders

#### 1. Create Order
```http
POST /orders
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shopId": "uuid",
  "deliveryAddressId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "specialInstructions": "Extra cheese"
    }
  ],
  "paymentMethod": "ONLINE",
  "couponCode": "FIRST50"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-20241222-001",
    "total": 498,
    "status": "PLACED",
    "paymentUrl": "https://razorpay.com/..."
  }
}
```

#### 2. Get My Orders
```http
GET /orders/my-orders?page=1&limit=10&status=DELIVERED
```

#### 3. Get Order Details
```http
GET /orders/:orderId
```

#### 4. Cancel Order
```http
POST /orders/:orderId/cancel
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

---

### Admin

#### 1. Get Pending Verifications
```http
GET /admin/verifications?type=vendor&status=PENDING
```
**Headers:** `Authorization: Bearer <admin_token>`

#### 2. Approve/Reject Vendor
```http
POST /admin/vendors/:vendorId/verify
```

**Request Body:**
```json
{
  "action": "APPROVE",
  "commissionRate": 20,
  "rejectionReason": ""
}
```

#### 3. Get Dashboard Stats
```http
GET /admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 1250,
    "activeVendors": 45,
    "activeDeliveryPartners": 30,
    "todayRevenue": 125000,
    "pendingVerifications": 5
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Specific error message"
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Admin endpoints**: 200 requests per 15 minutes

---

## Webhooks

### Payment Success
```http
POST /webhooks/payment
```

### Order Status Update
```http
POST /webhooks/order-status
```

---

**Last Updated:** December 22, 2024
