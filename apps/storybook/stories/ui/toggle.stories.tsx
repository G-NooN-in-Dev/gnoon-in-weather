import { Toggle } from '@shared/ui/toggle'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoldIcon } from 'lucide-react'

import { booleanArgType, selectArgType } from './_arg-types'

const meta = {
	title: 'UI/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	argTypes: {
		variant: selectArgType(['default', 'outline'], '토글 스타일 변형'),
		size: selectArgType(['default', 'sm', 'lg'], '토글 크기'),
		disabled: booleanArgType('비활성화 여부'),
		pressed: booleanArgType('눌림 상태')
	}
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		variant: 'outline',
		size: 'default',
		disabled: false,
		pressed: false,
		'aria-label': '굵게'
	},
	render: (args) => (
		<Toggle {...args}>
			<BoldIcon />
		</Toggle>
	)
}
