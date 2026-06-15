import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	selectSizeOptions,
	SelectTrigger,
	SelectValue
} from '@shared/ui/select'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type SelectStoryArgs = {
	value: string
	size: 'sm' | 'default'
	placeholder: string
	groupLabel: string
	disabled: boolean
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
		value: selectArgType(
			options.map((option) => option.value),
			'선택 값'
		),
		size: selectArgType(selectSizeOptions, '트리거 크기'),
		placeholder: textArgType('placeholder'),
		groupLabel: textArgType('그룹 라벨'),
		disabled: booleanArgType('비활성화 여부')
	},
	render: function Render({ value, size, placeholder, groupLabel, disabled }: SelectStoryArgs) {
		const { setArg } = useArgSync<SelectStoryArgs>()

		return (
			<Select
				value={value}
				onValueChange={(next) => {
					if (next) setArg('value', next)
				}}
			>
				<SelectTrigger className="w-[180px]" size={size} disabled={disabled}>
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
	}
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: 'apple',
		size: 'default',
		placeholder: '과일 선택',
		groupLabel: '과일',
		disabled: false
	}
}

export const Small: Story = {
	args: {
		value: 'apple',
		size: 'sm',
		placeholder: '과일 선택',
		groupLabel: '과일',
		disabled: false
	}
}

export const Disabled: Story = {
	args: { ...Default.args, disabled: true }
}
