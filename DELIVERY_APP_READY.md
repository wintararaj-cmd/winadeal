# 🚚 Delivery Partner App - Ready!

The **Delivery Partner Web App** has been successfully initialized and built.

---

## 🚀 How to Run

1.  Open a **New Terminal**.
2.  Navigate to the delivery directory:
    ```bash
    cd delivery-web
    ```
3.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    (This will likely start on `http://localhost:5174` or `5175`).

---

## 📱 Features Available

1.  **Partner Login**: Login using a dedicated delivery account.
2.  **Partner Register**: Simple flow to create a partner account.
    *   *Note*: After creating account, you might need to login manually.
3.  **Dashboard**:
    *   **Toggle Online**: Switch status (Online/Offline).
    *   **Active Orders**: View orders assigned to you.
    *   **Status Updates**:
        *   **Start Pickup** (When leaving for shop).
        *   **Confirm Pickup** (When picked up from shop).
        *   **Out for Delivery** (When leaving shop).
        *   **Mark Delivered** (When handed to customer).
4.  **Profile**: View details and Logout.
5.  **History**: View list of past delivered orders.
6.  **Earnings**: Track daily and total earnings from deliveries.

---

## 🧪 Testing the Full Loop

1.  **Vendor Panel**: Create a Shop, Add Products.
2.  **Customer Web**: Place an Order.
3.  **Vendor Panel**: Accept Order, Mark "Ready", **Assign Driver**.
4.  **Delivery Web**:
    *   Login as the assigned driver.
    *   You will see the order in Dashboard.
    *   Click "Start Pickup" -> "Confirm Pickup" -> "Delivered".
5.  **Customer Web**: Order status will update to "Delivered"!

---

### ⚠️ Note on Registration
The "Register" flow currently creates a User first. If you face issues, you can:
1.  Register a normal user on Customer App/Register page.
2.  Manually change their role to `DELIVERY` in Database (or I can build an Admin tool for it).
3.  Then login to Delivery App to complete profile.

Let's deliver some happiness! 🛵💨
