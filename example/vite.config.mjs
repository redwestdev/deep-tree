import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Replace 'process.env.NODE_ENV' with the current mode e.g., 'development' or 'production'
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      svgr({
        include: '**/*.svg?react',
      }),
    ],
    publicDir: path.resolve(__dirname, './public'),
    build: {
      outDir: path.resolve(__dirname, './build'),
    },
    resolve: {
      alias: {
        _api: path.resolve(__dirname, './src/_api'),
        api: path.resolve(__dirname, './src/api'),
        ws: path.resolve(__dirname, './src/ws'),
        main: path.resolve(__dirname, './src/main'),
        assets: path.resolve(__dirname, './src/assets'),
        components: path.resolve(__dirname, './src/components'),
        contexts: path.resolve(__dirname, './src/contexts'),
        dev: path.resolve(__dirname, './src/dev'),
        helpers: path.resolve(__dirname, './src/helpers'),
        hooks: path.resolve(__dirname, './src/hooks'),
        pages: path.resolve(__dirname, './src/pages'),
        router: path.resolve(__dirname, './src/router'),
        services: path.resolve(__dirname, './src/services'),
        store: path.resolve(__dirname, './src/store'),
        styles: path.resolve(__dirname, './src/styles'),
        translation: path.resolve(__dirname, './src/translation'),
        types: path.resolve(__dirname, './src/types'),
        ui: path.resolve(__dirname, './src/ui'),
        layouts: path.resolve(__dirname, './src/layouts'),
        queries: path.resolve(__dirname, './src/queries'),
        utils: path.resolve(__dirname, './src/utils'),
        managers: path.resolve(__dirname, './src/managers'),
        validation: path.resolve(__dirname, './src/validation'),
      },
    },
    assetsInclude: [
      '**/*.dcm',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.svg',
    ],
    server: {
      port: 3000,
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        ...env,
      },
    },
  };
});
