#!/bin/bash

echo "🚀 Building Plan B Portfolio for Render deployment..."

# 確保在正確的目錄
cd /opt/render/project/src

# 安裝根目錄依賴
echo "📦 Installing root dependencies..."
npm install

# 構建前端
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# 構建後端並複製前端文件
echo "📦 Building backend and copying frontend..."
cd ../backend
npm install
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Your app is ready for deployment to Render!"
