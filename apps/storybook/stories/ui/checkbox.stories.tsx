import { Checkbox } from '@shared/ui/checkbox'
import { Label } from '@shared/ui/label'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { booleanArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type CheckboxStoryArgs = ComponentProps<typeof Checkbox> & {
	label: string
}

const meta = {
	title: 'UI/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	argTypes: {
		label: textArgType('라벨 텍스트'),
		disabled: booleanArgType('비활성화 여부'),
		checked: booleanArgType('선택 상태')
	},
	render: function Render({ label, id = 'checkbox-demo', checked, ...checkboxProps }: CheckboxStoryArgs) {
		const { setArg } = useArgSync<{ checked?: boolean }>()

		return (
			<div className="flex items-center gap-2">
				<Checkbox
					id={id}
					{...checkboxProps}
					checked={checked}
					onCheckedChange={(next) => {
						// Controls는 boolean만 지원하므로 indeterminate는 false로 반영합니다.
						setArg('checked', next === true)
					}}
				/>
				<Label htmlFor={id}>{label}</Label>
			</div>
		)
	}
} satisfies Meta<CheckboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		label: '이용약관에 동의합니다',
		id: 'checkbox-demo',
		disabled: false,
		checked: false
	}
}

export const Checked: Story = {
	args: { ...Default.args, checked: true }
}

export const Disabled: Story = {
	args: { ...Default.args, disabled: true }
}
