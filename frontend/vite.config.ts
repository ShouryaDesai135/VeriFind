import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { qrcode } from "vite-plugin-qrcode";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    qrcode() // shows QR code in terminal
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // allows phone access
  },
});
