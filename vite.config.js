import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Configura el directorio de salida
    sourcemap: true, // Genera mapas de fuente para depuración
  },
});
