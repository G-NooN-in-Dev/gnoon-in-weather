import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, textArgType } from './_arg-types'

type LabelFieldStoryArgs = {
	label: string
	placeholder: string
	disabled: boolean
}

const meta = {
	title: 'UI/Label',
	tags: ['autodocs'],
	argTypes: {
		label: textArgType('라벨 텍스트'),
		placeholder: textArgType('입력 필드 placeholder'),
		disabled: booleanArgType('입력 필드 비활성화')
	},
	render: ({ label, placeholder, disabled }) => (
		<div className="grid w-full max-w-sm gap-2">
			<Label htmlFor="label-demo">{label}</Label>
			<Input id="label-demo" placeholder={placeholder} disabled={disabled} />
		</div>
	)
} satisfies Meta<LabelFieldStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		label: '이름',
		placeholder: '홍길동',
		disabled: false
	}
}
