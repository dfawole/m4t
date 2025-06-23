// vite.config.ts (at project root)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	// point Vite at your client folder
	root: path.resolve(__dirname, 'client'),
	base: '/',
	plugins: [react()],

	build: {
		// emit into client/dist
		outDir: path.resolve(__dirname, 'client/dist'),
		emptyOutDir: true,
	},

	server: {
		// if you want your dev server on a specific port
		port: 5173,
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'client/src'),
		},
	},
});
