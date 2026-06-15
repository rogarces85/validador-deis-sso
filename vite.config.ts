import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './', // Permite que la app funcione tanto en /Validador2026/ como en /estadisticas/validador/
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__APP_VERSION__': JSON.stringify(pkg.version),
      '__BUILD_DATE__': JSON.stringify(new Date().toISOString().split('T')[0]),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }

            if (id.includes('node_modules/xlsx') || id.includes('node_modules/xlsx-js-style')) {
              return 'excel-vendor';
            }

            if (id.includes('data/reglas_finales.json') || id.includes('data/celdas.catalog.json')) {
              return 'validation-data';
            }
          }
        }
      }
    }
  };
});
