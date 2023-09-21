/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'olive-green': '#1C4949',
				'olive-green-dark': '#163D3D',
				'green': '#299B71',
				'green-dark': '#1F8A63',
				'red': '#AD0626',
				'red-dark': '#990523'
			}
		},
	},
	plugins: [],
};
