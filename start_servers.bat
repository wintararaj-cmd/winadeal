@echo off
echo Starting WinADeal Ecosystem...

echo Starting Backend (Port 5000)...
start "Backend" cmd /k "cd backend && npm run dev"

echo Starting Admin Panel (Port 5173/5174)...
start "Admin Panel" cmd /k "cd admin-panel && npm run dev"

echo Starting Customer Web (Port 5173/5174)...
start "Customer Web" cmd /k "cd customer-web && npm run dev"

echo Starting Delivery Web (Port 5175)...
start "Delivery Web" cmd /k "cd delivery-web && npm run dev"

echo Starting Vendor Panel...
start "Vendor Panel" cmd /k "cd vendor-panel && npm run dev"

echo ===================================================
echo All servers are launching in separate windows.
echo Please wait for them to initialize.
echo ===================================================
pause
