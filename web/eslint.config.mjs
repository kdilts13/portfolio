import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // disables ESLint rules that conflict with Prettier

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'dist/**',
  ]),
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Integrate Prettier formatting as a lint rule
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          arrowParens: 'always',
        },
      ],
      // Reasonable additional rules
      'no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);

export default eslintConfig;
