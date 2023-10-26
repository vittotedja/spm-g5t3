import {defineConfig} from 'cypress';

export default defineConfig({
	projectId: 'oe9bun',
	e2e: {
		baseUrl: 'http://localhost:5173',
		defaultCommandTimeout: 10000,
	},
});
