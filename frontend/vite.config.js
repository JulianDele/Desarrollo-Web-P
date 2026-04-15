/* global process */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // URL base de la API según ambiente:
  //   development → proxy local a localhost:3000
  //   staging/production → VITE_API_URL definida en .env
  const apiTarget = env.VITE_API_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/tests/setupTests.js",
    },
  };
});
