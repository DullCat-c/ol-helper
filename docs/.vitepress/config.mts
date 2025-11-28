import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/ol-helper/',
  title: 'ol-helper',
  description: '基于openlayers的工具包,2维地图业务的实用开发,快速搭建2维地图并实现相关业务',
  // 添加 head 配置
  head: [['link', { rel: 'icon', href: 'logo.ico' }]],
  vite: {
    plugins: [
      UnoCSS(),
      // vue自动导入
      AutoImport({
        resolvers: [],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        imports: ['vue'],
        // 生成 eslint 全局变量定义配置。
        eslintrc: {
          enabled: false,
          filepath: './autoImport/.eslintrc-auto-import.json',
          globalsPropValue: 'readonly',
        },
        // 生成 TypeScript 全局变量定义配置。
        // dts: './autoImport/auto-imports.d.ts',
        dts: false,
      }),

      Components({
        resolvers: [],
        // dts: './autoImport/components.d.ts',
        dts: false,
        directoryAsNamespace: true,
      }),
    ],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/zh/start/introduction' },
    ],

    sidebar: [
      {
        text: '开始',
        collapsed: false,
        items: [
          { text: '简介', link: '/zh/start/introduction' },
          { text: '下载', link: '/zh/start/installation' },
        ],
      },
      {
        text: '基础',
        collapsed: false,
        items: [
          { text: '创建一个实例', link: '/zh/basic/makeMap' },
          { text: '控件', link: '/zh/basic/controller' },
          { text: '操作', link: '/zh/basic/makeMap2' },
          { text: '图层渲染和更新', link: '/zh/basic/render' },
          { text: '相关函数', link: '/zh/basic/makeMap5' },
          { text: '绘制', link: '/zh/basic/draw' },
          { text: '编辑', link: '/zh/basic/makeMap4' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  markdown: {
    // 代码块行号显示
    lineNumbers: true,
    // 图片懒加载
    image: {
      lazyLoading: true,
    },
    // 代码框内复制按钮的 title 提示
    codeCopyButtonTitle: '复制代码',
  },
});
