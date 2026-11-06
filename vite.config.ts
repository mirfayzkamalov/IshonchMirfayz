import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Mustaqil (Lovable'siz) sozlama: lokal `npm run dev` va `npm run build` uchun.
export default defineConfig(({ command }) => ({
  server: { host: "localhost", port: 5173 },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    // nitro faqat build vaqtida kerak
    ...(command === "build" ? [nitro()] : []),
  ],
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"] },
}));
