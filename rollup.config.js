import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	output: [{
		format: 'umd',
		name: 'SvelteElementPortal',
		file: pkg.main
	}, {
		format: 'es',
		file: pkg.module
	}],
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
	]
};
