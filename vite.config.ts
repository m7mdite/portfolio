import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy under a sub-path (e.g. https://user.github.io/portfolio/),
// set base to "/portfolio/" here. Asset paths in the config are resolved against it.
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
  build: {
    chunkSizeWarningLimit: 700,
  },
});
