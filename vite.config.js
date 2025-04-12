import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("lodash")) return "vendor-lodash";
            if (id.includes("react-quill")) return "vendor-quill";
            // You can add more dependencies here to create separate chunks/
            return "vendor";
          }
        },
      },
    },
  },
});