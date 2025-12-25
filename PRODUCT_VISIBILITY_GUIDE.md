# Product Visibility Troubleshooting Guide

## Issue: Products added by vendors not showing in customer portal

### Root Causes

For a product to be visible in the customer portal, **ALL** of the following conditions must be met:

#### 1. Shop Must Be Verified ✅
- **Location**: `backend/src/controllers/shop.controller.ts` (Line 16)
- **Condition**: `shop.isVerified = true`
- **How to fix**: 
  - Admin must approve the shop in the Admin Panel → Vendor Verification page
  - Click "Approve" on the pending shop

#### 2. Shop Must Be Open 🏪
- **Location**: `backend/src/controllers/shop.controller.ts` (Line 31)
- **Condition**: `shop.isOpen = true`
- **How to fix**:
  - Vendor logs into Vendor Panel
  - Goes to Shop Settings or Dashboard
  - Toggles "Shop Open" status to ON

#### 3. Product Must Be Available 📦
- **Location**: `backend/src/controllers/shop.controller.ts` (Line 100-101)
- **Condition**: `product.isAvailable = true`
- **How to fix**:
  - Vendor logs into Vendor Panel
  - Goes to Products page
  - Ensures the product's "Available" toggle is ON
  - Check that `stockQuantity` is greater than 0 (if applicable)

---

## Step-by-Step Verification Process

### For Vendors:
1. **Check Shop Status**
   - Login to Vendor Panel
   - Verify shop is approved by admin (check dashboard for verification status)
   - Ensure "Shop Open" toggle is enabled

2. **Check Product Status**
   - Go to Products page
   - Find the product you added
   - Verify:
     - ✅ "Available" toggle is ON
     - ✅ Stock quantity > 0 (if using inventory)
     - ✅ Product has a valid category assigned
     - ✅ Price is set correctly

### For Admins:
1. **Verify Shop Approval**
   - Login to Admin Panel
   - Go to Vendor Verification page
   - Find the vendor's shop
   - Click "Approve" if status is "Pending"

2. **Check Shop Details**
   - Verify shop has:
     - Valid category
     - Complete address
     - Valid GSTIN/FSSAI (if required)

---

## Common Issues & Solutions

### Issue 1: "Shop not appearing in customer portal"
**Cause**: Shop not verified or not open
**Solution**: 
- Admin: Approve the shop
- Vendor: Set shop status to "Open"

### Issue 2: "Products not showing even though shop is visible"
**Cause**: Products marked as unavailable
**Solution**: 
- Vendor: Go to Products → Edit product → Enable "Available" toggle

### Issue 3: "Products show in vendor panel but not customer portal"
**Cause**: Backend filters products by `isAvailable: true`
**Solution**: 
- Check product's `isAvailable` field in database
- Ensure vendor hasn't accidentally disabled the product

---

## Database Quick Check

Run this query to check product visibility:

```sql
SELECT 
  p.id,
  p.name,
  p.isAvailable,
  p.stockQuantity,
  s.name as shop_name,
  s.isVerified,
  s.isOpen
FROM "Product" p
JOIN "Shop" s ON p."shopId" = s.id
WHERE s.id = 'YOUR_SHOP_ID';
```

Expected values for visible products:
- `p.isAvailable` = `true`
- `s.isVerified` = `true`
- `s.isOpen` = `true`

---

## API Endpoints Reference

### Customer Portal Fetches:
1. **Shop List**: `GET /api/v1/shops?isOpen=true`
   - Returns only verified and open shops

2. **Shop Details**: `GET /api/v1/shops/:id`
   - Returns shop with products where `isAvailable = true`

### Vendor Panel:
1. **Product List**: `GET /api/v1/products?shopId=:shopId`
   - Returns ALL products (including unavailable ones)

---

## Quick Fix Checklist

- [ ] Admin approved the shop
- [ ] Shop "isVerified" = true in database
- [ ] Shop "isOpen" = true (vendor toggled it on)
- [ ] Product "isAvailable" = true
- [ ] Product has valid category
- [ ] Product has valid price
- [ ] Shop has valid category assigned
- [ ] No console errors in browser
- [ ] Backend server is running
- [ ] Customer portal is fetching from correct API URL

---

## Testing Steps

1. **Create Test Product** (as Vendor)
   ```
   - Login to vendor panel
   - Add new product with all required fields
   - Set "Available" toggle to ON
   - Save product
   ```

2. **Verify in Database**
   ```sql
   SELECT * FROM "Product" WHERE name = 'Test Product';
   -- Check isAvailable = true
   ```

3. **Check in Customer Portal**
   ```
   - Open customer portal
   - Navigate to shop detail page
   - Product should appear in menu
   ```

4. **If Still Not Visible**
   - Check browser console for errors
   - Check backend logs for API errors
   - Verify shop ID matches
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)

---

## Contact Points

- **Backend API**: `http://localhost:5000/api/v1`
- **Customer Portal**: `http://localhost:5175`
- **Vendor Portal**: `http://localhost:5176`
- **Admin Portal**: `http://localhost:5173`
