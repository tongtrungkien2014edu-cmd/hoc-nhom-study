import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Tách thư viện lớn để trình duyệt cache độc lập với mã ứng dụng.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/database'],
          motion: ['framer-motion'],
          dates: ['date-fns'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
