import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/season-clock-card.js",
      formats: ["es"],
      fileName: () => "seasonclock.js"
    },
    outDir: "dist",
    emptyOutDir: true,
    codeSplitting: false,
    rollupOptions: {
      output: {}
    }
  },
  server: {
    open: "/demo/"
  }
});
