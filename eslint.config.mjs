import eslintPluginTypescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginJSX from 'eslint-plugin-jsx-a11y'
import eslintPluginImport from 'eslint-plugin-import'

export default [
  {
    // Globally ignore certain files and directories
    ignores: ['node_modules/', 'dist/', 'out/', '.gitignore'],
  },
  {
    // Base configuration for your project
    languageOptions: {
      ecmaVersion: 2023, // Latest ECMAScript version
      sourceType: 'module',
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      prettier: eslintPluginPrettier,
      'jsx-a11y': eslintPluginJSX,
      import: eslintPluginImport,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',

      // React specific rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unstable-nested-components': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies

      // JSX Accessibility rules
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-role': 'warn',

      // Import rules
      'import/no-unresolved': 'error',
      'import/order': ['error', { 'newlines-between': 'always' }],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // Points to your tsconfig file
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  {
    // Override for JavaScript files
    files: ['*.js'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
]
