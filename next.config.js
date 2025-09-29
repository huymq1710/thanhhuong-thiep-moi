/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình cho Vite build (nếu cần)
  images: {
    // Domains cho external images
    domains: ['huymac-thiep-moi.vercel.app'],
    
    // Device sizes để tối ưu responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes cho different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Formats ưu tiên
    formats: ['image/webp', 'image/avif'],
    
    // Quality mặc định
    quality: 75,
    
    // Enable placeholder blur
    placeholder: 'blur',
    
    // Minimize layout shift
    minimumCacheTTL: 60,
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-photoswipe-gallery'],
  },
  
  // Compress responses
  compress: true,
  
  // Output configuration
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;