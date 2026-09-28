import { defineConfig } from 'vite';
export default defineConfig({base:'/explore-assets/',build:{outDir:'../dist/explore-assets',emptyOutDir:true,target:'es2022',rollupOptions:{input:'preview.html',onwarn(warning,warn){if(warning.code!=='MODULE_LEVEL_DIRECTIVE') warn(warning);}}}});
