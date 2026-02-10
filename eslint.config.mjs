import n8nPlugin from '@n8n/eslint-config/plugin.js';

export default [
  ...n8nPlugin.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
