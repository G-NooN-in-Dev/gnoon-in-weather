import { Spinner } from '@shared/ui/spinner'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType } from './_arg-types'

type SpinnerStoryArgs = {
	size: 'sm' | 'default' | 'lg'
}

const meta = {
	title: 'UI/Spinner',
	tags: ['autodocs'],
	argTypes: {
		size: selectArgType(['sm', 'default', 'lg'], '스피너 크기')
	},
	render: ({ size }) => <Spinner className={size === 'sm' ? 'size-3' : size === 'lg' ? 'size-8' : 'size-4'} />
} satisfies Meta<SpinnerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		size: 'default'
	}
}
