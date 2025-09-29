import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  
  build: {
    rollupOptions: {
      output: {
        // Tách assets theo type để tối ưu caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(webp|jpg|jpeg|png|svg)$/i.test(assetInfo.name!)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/\.(css)$/i.test(assetInfo.name!)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Tối ưu hóa chunk size
    chunkSizeWarningLimit: 1000,
    
    // Tối ưu hóa assets
    assetsInlineLimit: 4096, // Files < 4kb sẽ được inline thành base64
  },
  
  // Tối ưu hóa cho development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-photoswipe-gallery']
  },
  
  // Server configuration cho development
  server: {
    fs: {
      strict: false
    }
  }
});
