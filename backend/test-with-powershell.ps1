# PowerShell Test Script cho Customer Login API
Write-Host "====================================" -ForegroundColor Green
Write-Host "Testing LoTraDW Customer Login API" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET
    Write-Host "✅ Health Check Success:" -ForegroundColor Green
    Write-Host ($healthResponse | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔍 Make sure API server is running: node customer-login-api.js" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Testing Customer Login..." -ForegroundColor Yellow

$loginBody = @{
    email = "customer@test.com"
    password = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login Success:" -ForegroundColor Green
    Write-Host "📧 Email: $($loginResponse.data.user.email)" -ForegroundColor Cyan
    Write-Host "👤 Role: $($loginResponse.data.user.role)" -ForegroundColor Cyan
    Write-Host "🎫 Token: $($loginResponse.data.token.Substring(0, 50))..." -ForegroundColor Cyan
    
    $token = $loginResponse.data.token
    
    Write-Host ""
    Write-Host "3. Testing Profile with Token..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/customer/profile" -Method GET -Headers $headers
    Write-Host "✅ Profile Success:" -ForegroundColor Green
    Write-Host ($profileResponse | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing Invalid Login..." -ForegroundColor Yellow

$invalidLoginBody = @{
    email = "wrong@email.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $invalidLoginBody -ContentType "application/json"
    Write-Host "⚠️ Should have failed but didn't" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Invalid login correctly rejected" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 API Testing completed!" -ForegroundColor Green