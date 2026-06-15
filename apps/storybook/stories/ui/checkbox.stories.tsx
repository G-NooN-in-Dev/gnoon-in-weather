import { Checkbox } from '@shared/ui/checkbox'
import { Label } from '@shared/ui/label'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { booleanArgType, textArgType } from './_arg-types'

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
	render: ({ label, id = 'checkbox-demo', ...checkboxProps }) => (
		<div className="flex items-center gap-2">
			<Checkbox id={id} {...checkboxProps} />
			<Label htmlFor={id}>{label}</Label>
		</div>
	)
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
