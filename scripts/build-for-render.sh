#!/bin/bash

echo "🚀 Building Plan B Portfolio for Render deployment..."

# 進入前端目錄並構建
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# 創建後端的 public 目錄
echo "📁 Creating backend public directory..."
cd ../backend
mkdir -p public

# 複製前端構建文件到後端
echo "📋 Copying frontend build to backend..."
cp -r ../frontend/.next/* public/

# 創建 index.html 文件（Next.js 需要）
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
echo "🚀 Deploy the backend folder to Render"
