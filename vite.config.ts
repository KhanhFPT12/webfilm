import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // hls.js (~575 kB) chỉ được tải động khi API trả về nguồn .m3u8.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/hls.js")) return "hls";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});
