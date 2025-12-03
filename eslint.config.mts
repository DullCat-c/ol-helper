import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
// 导入 auto-import 配置
import autoImportConfig from './autoImport/.eslintrc-auto-import.json';

export default defineConfig([
  {
    ignores: [
      // 明确忽略不需要检查的目录和文件
      'node_modules/**',
      'dist/**',
      'autoImport/**',
      '**/dist/**',
      '**/cache/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      'package-lock.json',
      'yarn.lock',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    rules: {
      'no-unused-vars': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
    languageOptions: autoImportConfig,
  },
]);
