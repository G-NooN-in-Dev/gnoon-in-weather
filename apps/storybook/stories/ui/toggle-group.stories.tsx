import { ToggleGroup, ToggleGroupItem } from '@shared/ui/toggle-group'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react'

import { radioArgType, selectArgType } from './_arg-types'

type ToggleGroupStoryArgs = {
	defaultValue: string
	variant: 'default' | 'outline'
	orientation: 'horizontal' | 'vertical'
}

const meta = {
	title: 'UI/ToggleGroup',
	tags: ['autodocs'],
	argTypes: {
		defaultValue: selectArgType(['left', 'center', 'right'], '초기 선택 값'),
		variant: selectArgType(['default', 'outline'], '토글 그룹 스타일'),
		orientation: radioArgType(['horizontal', 'vertical'], '배치 방향')
	},
	render: ({ defaultValue, variant, orientation }) => (
		<ToggleGroup defaultValue={[defaultValue]} variant={variant} orientation={orientation}>
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
} satisfies Meta<ToggleGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		defaultValue: 'center',
		variant: 'default',
		orientation: 'horizontal'
	}
}
