import { Label } from '@shared/ui/label'
import { Switch } from '@shared/ui/switch'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'

/** Switch props + 라벨 텍스트(스토리 전용) */
type SwitchStoryArgs = ComponentProps<typeof Switch> & {
	label: string
}

const meta = {
	title: 'UI/Switch',
	component: Switch,
	tags: ['autodocs'],
	argTypes: {
		label: textArgType('라벨 텍스트'),
		size: selectArgType(['default', 'sm'], '스위치 크기'),
		disabled: booleanArgType('비활성화 여부'),
		checked: booleanArgType('켜짐 상태')
	},
	render: ({ label, id = 'switch-demo', ...switchProps }) => (
		<div className="flex items-center gap-2">
			<Switch id={id} {...switchProps} />
			<Label htmlFor={id}>{label}</Label>
		</div>
	)
} satisfies Meta<SwitchStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		label: '비행기 모드',
		id: 'switch-demo',
		size: 'default',
		disabled: false,
		checked: false
	}
}
