import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { vitePluginConfig } from './build';
const nodePolyfills = require('vite-plugin-node-stdlib-browser');

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const viteEnv = loadEnv(mode, root);

  const { VITE_DROP_CONSOLE } = viteEnv;

  return {
    plugins: [
      vue({ include: [/\.vue$/, /\.md$/] }),
      vueJsx(),
      UnoCSS(),
      // ext vite plugin
      vitePluginConfig(viteEnv),
      nodePolyfills()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    esbuild: {
      // 移除日志打印及debugger
      drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
    },
    // 处理ant-design-vue 样式文件
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    // 依赖优化 - 预构建
    optimizeDeps: {
      include: ['vue', 'pinia', 'vue-router', 'ant-design-vue/es', '@vueuse/core'],
    },
  };
});
