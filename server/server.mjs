import { polyfill } from '@astrojs/webapi';
import { ExpressApp } from './app.mjs';
import middleware from './middleware.mjs';
polyfill(globalThis, {
  exclude: 'window document',
});
function createExports(manifest) {
  const app = new ExpressApp(manifest);
  return {
    handler: middleware(app),
  };
}
function start(manifest, options) {
  return;
  // if (options.mode !== "standalone" || process.env.ASTRO_NODE_AUTOSTART === "disabled") {
  //   return;
  // }
  // const app = new ExpressApp(manifest);
  // startServer(app, options);
}
export { createExports, start };
