import { Spinner } from '@shared/ui/spinner'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type SpinnerStoryArgs = {
	className: string
}

const meta = {
	title: 'UI/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	argTypes: {
		// Spinner는 size prop이 없고 className으로 크기를 조절합니다.
		className: textArgType('추가 className (기본 size-4)')
	},
	render: ({ className }) => <Spinner className={className} />
} satisfies Meta<SpinnerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		className: 'size-4'
	}
}

export const Small: Story = {
	args: {
		className: 'size-3'
	}
}

export const Large: Story = {
	args: {
		className: 'size-8'
	}
}
