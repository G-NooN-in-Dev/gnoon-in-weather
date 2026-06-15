import { Slider } from '@shared/ui/slider'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { rangeArgType } from './_arg-types'

type SliderStoryArgs = {
	amount: number
	min: number
	max: number
	step: number
}

const meta = {
	title: 'UI/Slider',
	component: Slider,
	tags: ['autodocs'],
	argTypes: {
		amount: rangeArgType(0, 100, 1, '현재 값'),
		min: rangeArgType(0, 50, 1, '최솟값'),
		max: rangeArgType(50, 100, 1, '최댓값'),
		step: rangeArgType(1, 10, 1, '증감 단위')
	},
	render: ({ amount, min, max, step }) => (
		<Slider value={[amount]} min={min} max={max} step={step} className="w-[60%]" />
	)
} satisfies Meta<SliderStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		amount: 50,
		min: 0,
		max: 100,
		step: 1
	}
}
