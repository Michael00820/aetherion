import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), viteReact()],
  resolve: { tsconfigPaths: true },
  publicDir: "public",
  build: {
    outDir: "dist-android",
    emptyOutDir: true,
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: fileURLToPath(new URL("./index.android.html", import.meta.url)),
    },
  },
});
