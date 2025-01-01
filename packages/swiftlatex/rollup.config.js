import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import autoExternal from 'rollup-plugin-auto-external'
import sourcemaps from 'rollup-plugin-sourcemaps2'
import typescript from 'rollup-plugin-typescript2'

import copyFiles from './copyFiles'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    autoExternal({ packagePath: './package.json' }),
    sourcemaps(),
    babel({ babelHelpers: 'bundled' }),
    commonjs(),
    typescript(),
    copyFiles('./wasm', './dist', true),
  ],
}
