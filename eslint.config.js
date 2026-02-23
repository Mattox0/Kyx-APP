import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
    { ignores: ['dist/*', 'node_modules/*'] },

    expoConfig,

    ...pluginQuery.configs['flat/recommended'],

    // Désactive les règles ESLint qui entrent en conflit avec Prettier
    prettierConfig,

    {
        rules: {
            // Hooks
            'react-hooks/exhaustive-deps': 'off',

            // Qualité de code
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',

            // TypeScript
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

            // React
            'react/self-closing-comp': 'warn',
        },
    },
]);
