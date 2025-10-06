@echo off
echo ===================================
echo Testing LoTraDW Customer Login API
echo ===================================

echo.
echo 1. Testing Health Check...
curl -X GET http://localhost:3001/api/health
echo.

echo.
echo 2. Testing Customer Login...
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@test.com\",\"password\":\"123456\"}"
echo.

echo.
echo 3. Testing Profile (you need to copy token from login result)
echo    curl -X GET http://localhost:3001/api/customer/profile \
echo      -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.

pause