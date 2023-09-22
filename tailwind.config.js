/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'olive-green': '#1C4949'
			},
			fontFamily: {
				gotham: ['Gotham Book', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
