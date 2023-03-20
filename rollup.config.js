import resolve from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/main.js',
  output: [
    {
      format: 'esm',
      file: 'src/bundle.js'
    },
  ],
  plugins: [
    vue(),
    postcss({
      minimize: true,
      extensions: ['.css'],
    }),
    resolve(),
  ],
  external : ['vue-router'],
};