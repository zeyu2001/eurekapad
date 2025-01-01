import { nextJsConfig } from '@eurekapad/eslint-config/next-js'

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [
      '.next/',
      '.lintstagedrc.js',
      'next.config.mjs',
      'postcss.config.js',
      'tailwind.config.ts',
      'eslint.config.js',
      'convex/_generated/',
    ],
  },
]
