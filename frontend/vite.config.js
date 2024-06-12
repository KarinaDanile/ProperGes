import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
    server: isProduction ? undefined : {
      port: 5173,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:5173",
    },
    define: {
      'process.env': process.env,
    },
  }
});
