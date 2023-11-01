import {defineConfig} from 'cypress';

export default defineConfig({
	env: {
		SUPABASE_URL: 'a',
		SUPABASE_KEY: 'b',
	},
	e2e: {
		baseUrl: 'http://localhost:5173',
		defaultCommandTimeout: 100000,
	},
});
