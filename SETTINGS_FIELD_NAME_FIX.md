# Settings Save Error - Field Name Mismatch Fix

## Error
```
PUT http://localhost:5000/api/v1/shops/3ed03189-ebd0-48da-8a89-2b761f18a741 500 (Internal Server Error)
```

## Root Cause
**Field name mismatch** between frontend and backend:
- **Frontend** was sending: `deliveryRadius`
- **Backend** was expecting: `deliveryRadiusKm`

When Prisma tried to update the shop with the field `deliveryRadius`, it failed because that field doesn't exist in the database schema.

## Solution Applied ✅

### File: `vendor-panel/src/pages/Settings.tsx`

**Before:**
```typescript
const apiData = {
    name: formData.name,
    description: formData.description,
    address: formData.address,
    deliveryRadius: formData.deliveryRadius, // ❌ Wrong field name
    minOrderAmount: formData.minOrderAmount,
    openingTime: formData.openingTime,
    closingTime: formData.closingTime,
};
```

**After:**
```typescript
const apiData = {
    name: formData.name,
    description: formData.description,
    address: formData.address,
    deliveryRadiusKm: formData.deliveryRadius, // ✅ Correct field name
    minOrderAmount: formData.minOrderAmount,
    openingTime: formData.openingTime,
    closingTime: formData.closingTime,
};
```

## Database Schema Reference

```prisma
model Shop {
  // ... other fields ...
  deliveryRadiusKm  Int       @default(5)  // ✅ Correct field name
  minOrderAmount    Float     @default(0)
  openingTime       String?
  closingTime       String?
  // ... other fields ...
}
```

## Testing

**Steps to verify the fix:**
1. Login to Vendor Panel (http://localhost:5174)
2. Go to Settings page
3. Fill in all fields:
   - Shop Name
   - Description
   - Address
   - Opening Time (e.g., 09:00)
   - Closing Time (e.g., 22:00)
   - Delivery Radius (e.g., 5)
   - Min Order Amount (e.g., 100)
4. Click "Save Changes"
5. ✅ Should see success message: "Shop settings updated successfully!"
6. Refresh the page
7. ✅ All values should be preserved

## Status
✅ **FIXED** - Hot module reload applied the change automatically

The vendor panel has been updated and the fix is live!
