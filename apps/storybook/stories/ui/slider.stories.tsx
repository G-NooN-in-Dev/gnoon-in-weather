import { Slider, sliderOrientationOptions } from '@shared/ui/slider'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, radioArgType, rangeArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type SliderStoryArgs = {
	amount: number
	min: number
	max: number
	step: number
	disabled: boolean
	orientation: 'horizontal' | 'vertical'
}

const meta = {
	title: 'UI/Slider',
	component: Slider,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	},
	argTypes: {
		amount: rangeArgType(0, 100, 1, '현재 값'),
		min: rangeArgType(0, 50, 1, '최솟값'),
		max: rangeArgType(50, 100, 1, '최댓값'),
		step: rangeArgType(1, 10, 1, '증감 단위'),
		disabled: booleanArgType('비활성화 여부'),
		orientation: radioArgType(sliderOrientationOptions, '슬라이더 방향')
	},
	render: function Render({ amount, min, max, step, disabled, orientation }: SliderStoryArgs) {
		const { setArg } = useArgSync<SliderStoryArgs>()
		const clampedAmount = Math.min(Math.max(amount, min), max)
		const isVertical = orientation === 'vertical'

		return (
			<div className={isVertical ? 'flex h-48 items-center gap-4' : 'w-full max-w-md space-y-2'}>
				<Slider
					orientation={orientation}
					disabled={disabled}
					value={[clampedAmount]}
					min={min}
					max={max}
					step={step}
					className={isVertical ? 'h-full' : undefined}
					onValueChange={(next) => {
						const nextAmount = Array.isArray(next) ? next[0] : next
						if (nextAmount !== undefined) setArg('amount', nextAmount)
					}}
				/>
				<p className="text-muted-foreground text-sm">값: {clampedAmount}</p>
			</div>
		)
	}
} satisfies Meta<SliderStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		amount: 50,
		min: 0,
		max: 100,
		step: 1,
		disabled: false,
		orientation: 'horizontal'
	}
}

export const Vertical: Story = {
	args: { ...Default.args, orientation: 'vertical' }
}

export const Disabled: Story = {
	args: { ...Default.args, disabled: true }
}
