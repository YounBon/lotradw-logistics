# LoTraDW Logistics - Development Startup Script
Clear-Host
Write-Host "================================================" -ForegroundColor Green
Write-Host "   LoTraDW Logistics - Development Startup" -ForegroundColor Green  
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Kill existing node processes
Write-Host "🔄 Stopping any existing servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "� Starting development servers..." -ForegroundColor Cyan
Write-Host "   Backend (NestJS):   http://localhost:3001" -ForegroundColor White
Write-Host "   Frontend (Next.js): http://localhost:3000" -ForegroundColor White
Write-Host ""

# Start backend in new window
Write-Host "� Starting Backend (NestJS)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Starting...' -ForegroundColor Blue; npm run start:dev"

# Wait a bit then start frontend
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "🎨 Starting Frontend (Next.js)..." -ForegroundColor Green  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Starting...' -ForegroundColor Green; npm run frontend:dev"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check the opened PowerShell windows for server status." -ForegroundColor Yellow
Write-Host "Press any key to exit this launcher..." -ForegroundColor Gray

Read-Host