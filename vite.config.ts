// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa";

// //vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/focus/",
// });

// // ...

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// import icon192 from "icon-192.png";
// import icon512 from "public/logo-512.png";

// ...

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // 'auto', 'prompt', 'inline'
      manifest: {
        name: "Focus",
        short_name: "Focus",
        description: "Фокусируйся на главном",
        start_url: "/focus",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          {
            src: "logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // ... настройки Workbox
      },
    }),
  ],
  base: "/focus/",
});
