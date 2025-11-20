import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Hanya inject API_KEY jika dalam mode development.
      // Di production, key akan ditangani oleh Netlify Functions.
      'process.env.API_KEY': mode === 'development' ? JSON.stringify(env.API_KEY) : undefined,
    },
  };
});