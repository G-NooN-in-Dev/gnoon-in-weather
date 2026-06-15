import { Label } from '@shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@shared/ui/radio-group'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType } from './_arg-types'

type RadioGroupStoryArgs = {
	defaultValue: string
	disabled: boolean
}

const options = [
	{ value: 'default', label: '기본', id: 'radio-default' },
	{ value: 'comfortable', label: '편안함', id: 'radio-comfortable' },
	{ value: 'compact', label: '컴팩트', id: 'radio-compact' }
] as const

const meta = {
	title: 'UI/RadioGroup',
	component: RadioGroup,
	tags: ['autodocs'],
	argTypes: {
		defaultValue: selectArgType(
			options.map((option) => option.value),
			'초기 선택 값'
		),
		disabled: booleanArgType('비활성화 여부')
	},
	render: ({ defaultValue, disabled }) => (
		<RadioGroup defaultValue={defaultValue} disabled={disabled} className="max-w-sm">
			{options.map((option) => (
				<div key={option.value} className="flex items-center gap-2">
					<RadioGroupItem value={option.value} id={option.id} />
					<Label htmlFor={option.id}>{option.label}</Label>
				</div>
			))}
		</RadioGroup>
	)
} satisfies Meta<RadioGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		defaultValue: 'comfortable',
		disabled: false
	}
}
