// server/vite.ts
import express, { type Express } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer, createLogger, ServerOptions } from 'vite';
import type { Server as HttpServer } from 'http';
import viteConfig from '../vite.config';
import { nanoid } from 'nanoid';

const viteLogger = createLogger();

/**
 * Simple timestamped logger
 */
export function log(message: string, source = 'express') {
	const formattedTime = new Date().toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});
	console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * In development: spin up Vite in middleware mode (HMR, transforms, etc).
 */
export async function setupVite(app: Express, server: HttpServer) {
	const serverOptions: ServerOptions = {
		middlewareMode: true,
		hmr: { server },
		allowedHosts: true,
	};

	const vite = await createViteServer({
		...viteConfig,
		configFile: false,
		customLogger: {
			...viteLogger,
			error: (msg, options) => {
				viteLogger.error(msg, options);
				process.exit(1);
			},
		},
		server: serverOptions,
		appType: 'custom',
	});

	// Vite’s connect-style middleware
	app.use(vite.middlewares);

	// Serve index.html on all other routes, injecting HMR script
	app.use('*', async (req, res, next) => {
		const url = req.originalUrl;
		try {
			const clientTemplate = path.resolve(process.cwd(), 'client/index.html');
			let template = await fs.promises.readFile(clientTemplate, 'utf-8');
			// Force reload on each request during dev
			template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
			const page = await vite.transformIndexHtml(url, template);
			res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
		} catch (e) {
			vite.ssrFixStacktrace(e as Error);
			next(e);
		}
	});
}

/**
 * In production: serve the pre-built client from client/dist
 */
export function serveStatic(app: Express) {
	// The Vite build output lives at <repo-root>/client/dist
	const distPath = path.resolve(process.cwd(), 'client/dist');

	if (!fs.existsSync(distPath)) {
		throw new Error(`Cannot find client build at ${distPath}. Please run \`npm run build\` first.`);
	}

	// Serve static assets
	app.use(express.static(distPath));

	// Single-page app fallback to index.html
	app.get('*', (_req, res) => {
		res.sendFile(path.join(distPath, 'index.html'));
	});
}
