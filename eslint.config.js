// Flat config (ESLint 9). Expo qoidalari + loyihaga xos bir nechta qat'iy talab.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'web-build/**', 'coverage/**'],
  },
  {
    rules: {
      // Interfeys o'zbekcha: matnda apostrof («o'chirish») tabiiy holat,
      // uni HTML-entity qilib yozish kodni o'qib bo'lmas holga keltiradi.
      'react/no-unescaped-entities': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    files: ['**/__tests__/**/*.{ts,tsx}', 'jest.setup.js'],
    rules: { 'no-undef': 'off' },
  },
];
