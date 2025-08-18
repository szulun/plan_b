#!/bin/bash

echo "🚀 Building Plan B Portfolio for Render deployment..."

# 確保在正確的目錄
cd /opt/render/project/src

# 安裝後端依賴
echo "📦 Installing backend dependencies..."
cd backend
npm install

# 安裝前端依賴並構建
echo "📦 Building frontend..."
cd ../frontend
npm install
npm run build

# 創建後端的 public 目錄並複製前端文件
echo "📁 Creating backend public directory..."
cd ../backend
mkdir -p public

echo "📋 Copying frontend build to backend..."
cp -r ../frontend/.next/* public/

# 創建 index.html 文件
echo "📄 Creating index.html..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan B Portfolio</title>
    <meta name="description" content="A clean and beautiful investment tracker">
</head>
<body>
    <div id="__next"></div>
    <script>
        // 重定向到 Next.js 應用的主頁
        window.location.href = '/dashboard';
    </script>
</body>
</html>
EOF

echo "✅ Build completed successfully!"
echo "🌐 Your app is ready for deployment to Render!"
echo "📁 Frontend files are now in backend/public/"
