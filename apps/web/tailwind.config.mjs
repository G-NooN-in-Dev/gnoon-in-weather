import sharedTailwindConfig from '@shared/tailwind-config/config'

/** @type {import('tailwindcss').Config} */
const config = {
	...sharedTailwindConfig,
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}'
	]
}

export default config
