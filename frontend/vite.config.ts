import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configuración del alias universal '@' apuntando a la raíz del código fuente
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true, // Habilita el acceso externo dentro de redes o contenedores Docker
    watch: {
      usePolling: true, // Asegura que los cambios se detecten correctamente dentro de volúmenes Docker
    },
  },
});
