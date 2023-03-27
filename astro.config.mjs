import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [],
  
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
