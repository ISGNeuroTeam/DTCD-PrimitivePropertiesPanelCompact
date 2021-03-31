import path from 'path';

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import image from '@rollup/plugin-image';
import vue from 'rollup-plugin-vue';
import replace from '@rollup/plugin-replace';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = 'PrimitivePropertiesPanel';

const projectSrcDir = path.join(path.resolve(__dirname), 'src');

const fileDest = watch ? `./../../DTCD/server/plugins/DTCD-${pluginName}/${pluginName}.js` : `./build/${pluginName}.js`;

const plugins = [
	commonjs(),
	alias({
		entries: {
			'@': projectSrcDir,
		},
	}),
	vue(),
	image(),
	replace({
		preventAssignment: true,
		'process.env.NODE_ENV': JSON.stringify('development'),
		'process.env.VUE_ENV': JSON.stringify('browser'),
	}),
	styles({
		mode: 'inject',
	}),
];

export default {
	input: `src/${pluginName}`,
	output: {
		file: fileDest,
		format: 'esm',
		sourcemap: false,
	},
	watch: {
		include: ['./src/**'],
	},
	plugins,
};
