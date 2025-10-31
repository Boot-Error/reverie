import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginUmd } from '@rsbuild/plugin-umd';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

// Custom plugin for post-build packaging
const pluginZipAfterBuild = (): RsbuildPlugin => ({
  name: 'plugin-zip-after-build',
  setup(api) {
    api.onAfterBuild(() => {
      const distDir = path.resolve(__dirname, 'dist');

      // Ensure manifest.json is copied
      const manifestSrc = path.resolve(__dirname, 'public/manifest.json');
      const manifestDest = path.join(distDir, 'manifest.json');
      fs.copyFileSync(manifestSrc, manifestDest);

      // Copy assets (icons, etc.)
      const assetsDir = path.resolve(__dirname, 'src/assets');
      if (fs.existsSync(assetsDir)) {
        fs.cpSync(assetsDir, path.join(distDir, 'assets'), { recursive: true });
      }

      // Create zip
      const zip = new AdmZip();
      zip.addLocalFolder(distDir);
      const zipPath = path.resolve(__dirname, 'extension.zip');
      zip.writeZip(zipPath);

      console.log(`✅ Chrome extension package created at: ${zipPath}`);
    });
  },
});

// export default defineConfig({
//   plugins: [pluginReact()],
//   source: {
//     entry: {
//       popup: './src/app/popup-ui/main.tsx',
//       'search-dashboard': './src/app/search-dashboard-ui/main.tsx',
//       'tab-content-grabber': './src/app/tab-content-grabber/main.ts',
//       background: './src/app/worker/main.ts',
//     },

//     include: ['src', '/node_modules[\\/]minisearch[//\]/'],
//   },
//   resolve: {
//     mainFields: ['module', 'browser', 'main'], // prefer ESM
//   },
//   optimization: {
//     concatenateModules: true, // enable module concatenation
//     splitChunks: {
//       cacheGroups: {
//         defaultVendors: {
//           test: /[\\/]node_modules[\\/](?!minisearch)/,
//           name: 'vendors',
//           chunks: 'all',
//         },
//       },
//     },
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     minify: {
//       js: false,
//     },
//     filenameHash: false,
//     cleanDistPath: true,
//     sourceMap: {
//       js: 'source-map',
//     },
//     target: 'web',
//     enableAssetModuleDefaultExport: true,
//     externals: {},
//   },
//   tools: {
//     postcss: {},
//     rspack: {
//       target: ['web'],
//       builtins: {
//         define: {
//           'process.env.NODE_ENV': JSON.stringify(
//             process.env.NODE_ENV || 'production',
//           ),
//         },
//       },
//     },
//   },
// });

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      popup: './src/app/popup-ui/main.tsx',
      'search-dashboard': './src/app/search-dashboard-ui/main.tsx',
      'tab-content-grabber': './src/app/tab-content-grabber/main.ts',
      background: './src/app/worker/main.ts',
    },
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    // Explicitly allow Fuse.js (and others) to be bundled
    alias: {
      'fuse.js': path.resolve('./node_modules/fuse.js/dist/fuse.mjs'),
    },
  },
  optimization: {
    concatenateModules: true,
    splitChunks: {
      cacheGroups: {
        // prevent background.js from splitting
        background: {
          name: 'background',
          chunks: (chunk) => chunk.name === 'background',
          enforce: true,
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/](?!fuse\.js)/,
          name: 'vendors',
          chunks: (chunk) => chunk.name !== 'background',
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filenameHash: false,
    minify: { js: false },
    cleanDistPath: true,
    target: 'web',
  },
  tools: {
    rspack: {
      builtins: {
        define: {
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'production',
          ),
        },
      },
      externalsType: 'var', // force internal bundling
      externalsPresets: { web: false },
    },
  },
});
