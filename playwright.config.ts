import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4175";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL },
  projects: [
    { name: "mobile", use: { viewport: { width: 320, height: 640 } } },
    { name: "tablet", use: { viewport: { width: 1024, height: 768 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4175 --strictPort",
    url: baseURL,
  },
});
