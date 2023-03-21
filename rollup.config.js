import resolve from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'src/bundle.js',
      format: 'esm'
    },
  ],
  plugins: [
    vue(),
    postcss({
      minimize: true,
      extensions: ['.css'],
    }),
    resolve(),
    commonjs()
  ],
};