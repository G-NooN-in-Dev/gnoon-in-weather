import { orientationOptions } from '@shared/ui/lib/layout-options'
import { toggleSizeOptions, toggleVariantOptions } from '@shared/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@shared/ui/toggle-group'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react'

import { radioArgType, rangeArgType, selectArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type ToggleGroupStoryArgs = {
	value: string
	variant: 'default' | 'outline'
	size: 'default' | 'sm' | 'lg'
	spacing: number
	orientation: 'horizontal' | 'vertical'
}

const meta = {
	title: 'UI/ToggleGroup',
	tags: ['autodocs'],
	argTypes: {
		value: selectArgType(['left', 'center', 'right'], '선택 값'),
		variant: selectArgType(toggleVariantOptions, '토글 그룹 스타일'),
		size: selectArgType(toggleSizeOptions, '토글 크기'),
		spacing: rangeArgType(0, 4, 1, '아이템 간격 (0이면 segmented 스타일)'),
		orientation: radioArgType(orientationOptions, '배치 방향')
	},
	args: {
		value: 'center',
		variant: 'default',
		size: 'default',
		spacing: 2,
		orientation: 'horizontal'
	},
	render: function Render({ value, variant, size, spacing, orientation }: ToggleGroupStoryArgs) {
		const { setArg } = useArgSync<ToggleGroupStoryArgs>()

		return (
			<ToggleGroup
				value={[value]}
				onValueChange={(next) => {
					const selected = next[0]
					if (selected) setArg('value', selected)
				}}
				variant={variant}
				size={size}
				spacing={spacing}
				orientation={orientation}
			>
				<ToggleGroupItem value="left" aria-label="Align left">
					<AlignLeftIcon />
				</ToggleGroupItem>
				<ToggleGroupItem value="center" aria-label="Align center">
					<AlignCenterIcon />
				</ToggleGroupItem>
				<ToggleGroupItem value="right" aria-label="Align right">
					<AlignRightIcon />
				</ToggleGroupItem>
			</ToggleGroup>
		)
	}
} satisfies Meta<ToggleGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Segmented: Story = {
	args: {
		variant: 'outline',
		spacing: 0
	}
}

export const Vertical: Story = {
	args: {
		orientation: 'vertical'
	}
}
