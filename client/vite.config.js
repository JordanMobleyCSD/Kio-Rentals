import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Build output goes straight into the server's public folder
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "../server/public"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
