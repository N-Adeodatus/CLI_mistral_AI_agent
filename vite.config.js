import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'node18', // Target Node.js 18
        outDir: 'dist', // Output directory
        rollupOptions: {
            input: './src/index.js', // Entry point for your app
            output: {
                format: 'cjs', // CommonJS format for Node.js
                entryFileNames: '[name].cjs', // Use .cjs extension
                dir: 'dist', // Output directory
            },
            external: [
                'fs', 'path', 'os', 'crypto', 'fs/promises', 'node:readline', 'dotenv'
            ],
        },
        emptyOutDir: true, // Clean the output directory before building
    },
});