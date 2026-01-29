import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default defineConfig([
  expoConfig,

  ...pluginQuery.configs['flat/recommended'],

  {
    ignores: ['dist/*'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
    },
  },
]);
