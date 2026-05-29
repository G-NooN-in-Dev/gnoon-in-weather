import { config } from '@shared/eslint-config/react-internal'
import storybook from 'eslint-plugin-storybook'

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		ignores: ['storybook-static/**', 'node_modules/**']
	},
	...config,
	...storybook.configs['flat/recommended']
]
