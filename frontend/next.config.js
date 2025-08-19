/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // 在生產環境中，API 請求會直接發送到 Render 後端
    // 在開發環境中，重寫到 localhost
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = isDev ? 'http://localhost:5001' : 'https://plan-b-p4t8.onrender.com';
    
    return [
      {
        source: '/api/market-sentiment/:path*',
        destination: `${backendUrl}/api/market-sentiment/:path*`,
      },
      {
        source: '/api/portfolio/:path*',
        destination: `${backendUrl}/api/portfolio/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        source: '/api/feedback/:path*',
        destination: `${backendUrl}/api/feedback/:path*`,
      },
      {
        source: '/api/quote/:path*',
        destination: `${backendUrl}/api/quote/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;