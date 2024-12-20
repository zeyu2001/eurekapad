module.exports = {
  root: true,
  extends: ['@eurekapad/eslint-config/index.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'wasm/', '.*.js'],
}
