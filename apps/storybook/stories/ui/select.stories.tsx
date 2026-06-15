import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@shared/ui/select'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

type SelectStoryArgs = {
	defaultValue: string
	placeholder: string
	groupLabel: string
}

const options = [
	{ value: 'apple', label: '사과' },
	{ value: 'banana', label: '바나나' },
	{ value: 'orange', label: '오렌지' }
] as const

const meta = {
	title: 'UI/Select',
	tags: ['autodocs'],
	argTypes: {
		defaultValue: selectArgType(
			options.map((option) => option.value),
			'초기 선택 값'
		),
		placeholder: textArgType('placeholder'),
		groupLabel: textArgType('그룹 라벨')
	},
	render: ({ defaultValue, placeholder, groupLabel }) => (
		<Select defaultValue={defaultValue}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{groupLabel}</SelectLabel>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		defaultValue: 'apple',
		placeholder: '과일 선택',
		groupLabel: '과일'
	}
}
