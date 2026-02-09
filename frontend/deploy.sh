#!/bin/bash

# Quick Deployment Script for Smart Crop Advisory Frontend
# This script helps you build and prepare for deployment

echo "🌾 Smart Crop Advisory - Deployment Helper"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build the project
echo "🔨 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📁 Production files are in the 'dist' folder"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. For Vercel:     vercel"
    echo "   2. For Netlify:    netlify deploy --prod"
    echo "   3. For Firebase:   firebase deploy"
    echo "   4. For GitHub:     npm run deploy (after setup)"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

