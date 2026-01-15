import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import viteCompression from 'vite-plugin-compression';
import UnoCSS from 'unocss/vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [ElementPlusResolver()],
      // dts: './autoImport/components.d.ts',
      dts: false,
      directoryAsNamespace: true,
    }),
    // vue自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        'vue',
        'vue-router',
        {
          'element-plus/es': ['ElMessage', 'ElMessageBox', 'ElNotification', 'ElLoading'],
        },
      ],
      // 生成 eslint 全局变量定义配置。
      eslintrc: {
        // enabled: true,
        enabled: false,
        filepath: './autoImport/.eslintrc-auto-import.json',
        globalsPropValue: 'readonly',
      },
      // 生成 TypeScript 全局变量定义配置。
      // dts: './autoImport/auto-imports.d.ts',
      dts: false,
    }),
    dts({
      insertTypesEntry: true, // 在生成的包的根目录中插入一个类型入口文件
      include: ['olHelper/olHelper.ts'],
      outDir: 'dist',
    }),
    // mkcert(),
    // viteCompression({
    //   threshold: 1024, // 对大于 1kb 的文件进行压缩
    // }),
  ],

  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'olHelper/olHelper.ts'),
      // 库名称
      name: 'ol-helper',
      formats: ['es', 'umd', 'cjs'], // 多种格式
      // 输出文件名
      fileName: (format) => `ol-helper.${format}.js`,
    },
    // 生成 sourcemap
    // sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    // https: true,
    port: 4200,
    host: true,
  },
  envDir: './env',
  // assetsInclude: ['**/*.png'],
});
