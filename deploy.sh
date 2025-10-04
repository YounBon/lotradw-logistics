#!/bin/bash

# Deploy script for LoTraDW Logistics
echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for deployment!"
    echo ""
    echo "📋 Manual Vercel Deploy Steps:"
    echo "1. Go to https://vercel.com/new"
    echo "2. Import Git Repository"
    echo "3. Select: YounBon/lotradw-logistics"
    echo "4. Framework: Next.js (auto-detected)"
    echo "5. Click Deploy"
    echo ""
    echo "🔗 Repository: https://github.com/YounBon/lotradw-logistics"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi