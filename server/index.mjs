// Based on node_modules\@astrojs\node\dist\index.js
function getAdapter(options) {
    return {
      name: '@astrojs/node',
      serverEntrypoint: './server/server.mjs',
      previewEntrypoint: '@astrojs/node/preview.js',
      exports: ['handler'],
      args: options,
    };
  }
  function createIntegration(userOptions) {
    if (!(userOptions == null ? void 0 : userOptions.mode)) {
      throw new Error(`[@astrojs/node] Setting the 'mode' option is required.`);
    }
    let needsBuildConfig = false;
    let _options;
    return {
      name: '@astrojs/node',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            vite: {
              ssr: {
                noExternal: ['@astrojs/node'],
              },
            },
          });
        },
        'astro:config:done': ({ setAdapter, config }) => {
          var _a, _b, _c;
          needsBuildConfig = !((_a = config.build) == null ? void 0 : _a.server);
          _options = {
            ...userOptions,
            client: (_b = config.build.client) == null ? void 0 : _b.toString(),
            server: (_c = config.build.server) == null ? void 0 : _c.toString(),
            host: config.server.host,
            port: config.server.port,
          };
          setAdapter(getAdapter(_options));
          if (config.output === 'static') {
            console.warn(
              `[@astrojs/node] \`output: "server"\` is required to use this adapter.`
            );
          }
        },
        'astro:build:start': ({ buildConfig }) => {
          if (needsBuildConfig) {
            _options.client = buildConfig.client.toString();
            _options.server = buildConfig.server.toString();
          }
        },
      },
    };
  }
  export { createIntegration as default, getAdapter };
  