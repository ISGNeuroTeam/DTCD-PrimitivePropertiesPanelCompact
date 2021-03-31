import vue from 'rollup-plugin-vue2';
import alias from '@rollup/plugin-alias';
import styles from 'rollup-plugin-styles';
import replace from '@rollup/plugin-replace';

import path from 'path';
import pluginMeta from './src/Plugin.Meta';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = pluginMeta.name;
const outputFile = `${pluginName}.js`;
const outputDirectory = watch ? `./../../DTCD/server/plugins/DTCD-${pluginName}` : `./build`;

const plugins = [
  vue(),
  alias({
    entries: {
      '@': path.resolve(__dirname, 'src'),
    },
  }),
  styles({
    mode: 'inject',
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.VUE_ENV': JSON.stringify('browser'),
  }),
];

export default {
  plugins,
  input: `src/PrimitivePropertiesPanel.js`,
  output: {
    file: `${outputDirectory}/${outputFile}`,
    format: 'esm',
    sourcemap: false,
  },
  watch: {
    include: ['./src/**'],
  },
};
