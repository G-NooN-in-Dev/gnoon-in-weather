import { Label } from '@shared/ui/label'
import { Switch, switchSizeOptions } from '@shared/ui/switch'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

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
		size: selectArgType(switchSizeOptions, '스위치 크기'),
		disabled: booleanArgType('비활성화 여부'),
		checked: booleanArgType('켜짐 상태')
	},
	render: function Render({ label, id = 'switch-demo', checked, ...switchProps }: SwitchStoryArgs) {
		const { setArg } = useArgSync<{ checked?: boolean }>()

		return (
			<div className="flex items-center gap-2">
				<Switch
					id={id}
					{...switchProps}
					checked={checked}
					onCheckedChange={(next) => {
						setArg('checked', next)
					}}
				/>
				<Label htmlFor={id}>{label}</Label>
			</div>
		)
	}
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

export const Small: Story = {
	args: { ...Default.args, size: 'sm', id: 'switch-sm' }
}

export const Checked: Story = {
	args: { ...Default.args, checked: true }
}

export const Disabled: Story = {
	args: { ...Default.args, disabled: true }
}
