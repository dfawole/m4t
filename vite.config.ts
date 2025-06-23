// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	// Tell Vite your client lives in /client
	root: path.resolve(__dirname, 'client'),

	plugins: [react()],

	resolve: {
		alias: {
			// “@” → client/src
			'@': path.resolve(__dirname, 'client/src'),
			// “@shared” → shared/
			'@shared': path.resolve(__dirname, 'shared'),
		},
	},

	server: {
		fs: {
			// allow serving files from one level up
			allow: [path.resolve(__dirname, 'client'), path.resolve(__dirname, 'shared')],
		},
	},

	build: {
		// emit into client/dist
		outDir: path.resolve(__dirname, 'client/dist'),
		emptyOutDir: true,
	},
});
