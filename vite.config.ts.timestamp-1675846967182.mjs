// vite.config.ts
import { defineConfig } from "file:///Users/ozorku/Work/Projects/cmdb/cmdb-ext/node_modules/vite/dist/node/index.js";
import react from "file:///Users/ozorku/Work/Projects/cmdb/cmdb-ext/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///Users/ozorku/Work/Projects/cmdb/cmdb-ext/node_modules/vite-plugin-svgr/dist/index.mjs";
import { crx } from "file:///Users/ozorku/Work/Projects/cmdb/cmdb-ext/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "cmdb",
  version: "1.0.0",
  offline_enabled: true,
  action: {
    default_title: "Cmd+B",
    default_icon: "logo192.png"
  },
  icons: {},
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["content-script/main.tsx"],
      media: []
    }
  ],
  background: {
    service_worker: "background/index.ts",
    persistent: false
  },
  permissions: ["activeTab", "tabs", "bookmarks", "scripting", "storage"],
  host_permissions: [
    "https://www.googleapis.com/*",
    "https://gstatic.com/*",
    "*://*/*"
  ],
  commands: {
    "open-cmdb": {
      suggested_key: {
        default: "Ctrl+B",
        windows: "Ctrl+B",
        mac: "Command+B",
        chromeos: "Ctrl+B",
        linux: "Ctrl+B"
      },
      description: "Open / Close extension"
    }
  }
};

// vite.config.ts
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/ozorku/Work/Projects/cmdb/cmdb-ext";
var vite_config_default = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      }
    }
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true
      }
    }),
    crx({ manifest: manifest_default })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvb3pvcmt1L1dvcmsvUHJvamVjdHMvY21kYi9jbWRiLWV4dFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL296b3JrdS9Xb3JrL1Byb2plY3RzL2NtZGIvY21kYi1leHQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL296b3JrdS9Xb3JrL1Byb2plY3RzL2NtZGIvY21kYi1leHQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHN2Z3IgZnJvbSBcInZpdGUtcGx1Z2luLXN2Z3JcIjtcbmltcG9ydCB7IGNyeCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcbmltcG9ydCBtYW5pZmVzdCBmcm9tIFwiLi9tYW5pZmVzdC5qc29uXCI7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiaW5kZXguaHRtbFwiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgc3Zncih7XG4gICAgICBzdmdyT3B0aW9uczoge1xuICAgICAgICBpY29uOiB0cnVlLFxuICAgICAgICAvLyAuLi5zdmdyIG9wdGlvbnMgKGh0dHBzOi8vcmVhY3Qtc3Znci5jb20vZG9jcy9vcHRpb25zLylcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLy8gQnVpbGQgQ2hyb21lIEV4dGVuc2lvblxuICAgIGNyeCh7IG1hbmlmZXN0IH0pLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQVMsb0JBQW9CO0FBQzFVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFcEIsU0FBUyxlQUFlO0FBTHhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE1BQU0sUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDdkM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsYUFBYTtBQUFBLFFBQ1gsTUFBTTtBQUFBLE1BRVI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUVELElBQUksRUFBRSwyQkFBUyxDQUFDO0FBQUEsRUFDbEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
