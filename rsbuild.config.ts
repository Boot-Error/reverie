import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
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

export default defineConfig({
  plugins: [pluginReact(), pluginZipAfterBuild()],
  source: {
    entry: {
      popup: './src/app/popup-ui/main.tsx',
      'search-dashboard': './src/app/search-dashboard-ui/main.tsx',
      'tab-content-grabber': './src/app/tab-content-grabber/main.ts',
      background: './src/app/worker/main.ts',
    },
  },
  html: {
    templates: [
      {
        template: './public/popup-ui.html',
        filename: 'popup-ui.html',
        entry: 'popup-ui',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    minify: {
      js: false,
    },
    filenameHash: false,
    cleanDistPath: true,
    sourceMap: {
      js: 'source-map',
    },
  },
  tools: {
    postcss: {},
    rspack: {
      target: ['web'],
      builtins: {
        define: {
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'production',
          ),
        },
      },
    },
  },
});
