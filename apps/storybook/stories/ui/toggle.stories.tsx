import { Toggle, toggleSizeOptions, toggleVariantOptions } from '@shared/ui/toggle'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoldIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { booleanArgType, selectArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

const meta = {
	title: 'UI/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	argTypes: {
		variant: selectArgType(toggleVariantOptions, '토글 스타일 변형'),
		size: selectArgType(toggleSizeOptions, '토글 크기'),
		disabled: booleanArgType('비활성화 여부'),
		pressed: booleanArgType('눌림 상태')
	},
	render: function Render(args: ComponentProps<typeof Toggle>) {
		const { setArg } = useArgSync<{ pressed?: boolean }>()

		return (
			<Toggle
				{...args}
				onPressedChange={(pressed) => {
					setArg('pressed', pressed)
				}}
			>
				<BoldIcon />
			</Toggle>
		)
	}
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		variant: 'default',
		size: 'default',
		disabled: false,
		pressed: false,
		'aria-label': '굵게'
	}
}

export const Outline: Story = {
	args: {
		variant: 'outline',
		size: 'default',
		disabled: false,
		pressed: false,
		'aria-label': '굵게'
	}
}

export const Small: Story = {
	args: { ...Default.args, size: 'sm' }
}

export const Large: Story = {
	args: { ...Default.args, size: 'lg' }
}

export const Pressed: Story = {
	args: { ...Default.args, pressed: true }
}

export const Disabled: Story = {
	args: { ...Default.args, disabled: true }
}
