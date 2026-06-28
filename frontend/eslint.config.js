// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

// Rules encode this project's style guide; see ../style-guide/style-guide.ts.md
// and ../style-guide/style-guide.html.md. Formatting is owned by Prettier, so
// `prettier` is extended last to switch off any stylistic rules that conflict.
module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettier,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        // Type-aware linting, needed for rules like prefer-readonly.
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // --- Angular selectors (prefix matches angular.json) ---
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],

      // --- Correctness / safety ---
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],

      // --- Encapsulation / immutability ---
      'prefer-const': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],

      // --- Naming ---
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/naming-convention': [
        'error',
        // No "I" prefix on interfaces.
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        // No leading underscore on private/protected members.
        {
          selector: ['classProperty', 'classMethod', 'accessor'],
          format: null,
          leadingUnderscore: 'forbid',
        },
      ],

      // --- Readability ---
      'one-var': ['error', 'never'],
      'prefer-arrow-callback': 'error',
      complexity: ['warn', 20],
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
    },
  },
]);
