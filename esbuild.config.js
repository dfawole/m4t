// esbuild.config.js
// import { build } from 'esbuild';

// build({
// 	entryPoints: ['server/index.ts'],
// 	bundle: true,
// 	platform: 'node',
// 	format: 'esm',
// 	outdir: 'dist',
// 	external: ['@babel/preset-typescript/package.json', 'lightningcss', 'lightningcss/*'],
// }).catch(() => process.exit(1));

import { build } from 'esbuild';

build({
	entryPoints: ['server/index.ts'],
	bundle: true,
	platform: 'node',
	format: 'esm',
	outdir: 'dist',
	external: [
		'@babel/preset-typescript/package.json',
		'lightningcss',
		'lightningcss/*',
		'fsevents',
		'*.node',
	],
	loader: { '.node': 'file' },
}).catch(() => process.exit(1));
