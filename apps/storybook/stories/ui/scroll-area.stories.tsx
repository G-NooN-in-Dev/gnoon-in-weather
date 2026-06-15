import { ScrollArea } from '@shared/ui/scroll-area'
import { Separator } from '@shared/ui/separator'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { rangeArgType, textArgType } from './_arg-types'

type ScrollAreaStoryArgs = {
	height: number
	itemCount: number
	heading: string
}

const meta = {
	title: 'UI/ScrollArea',
	tags: ['autodocs'],
	argTypes: {
		height: rangeArgType(120, 320, 10, '스크롤 영역 높이 (px)'),
		itemCount: rangeArgType(5, 30, 1, '목록 항목 수'),
		heading: textArgType('목록 제목')
	},
	render: ({ height, itemCount, heading }) => (
		<ScrollArea className="w-48 rounded-md border" style={{ height }}>
			<div className="p-4">
				<h4 className="mb-4 text-sm font-medium">{heading}</h4>
				{Array.from({ length: itemCount }).map((_, index) => (
					<div key={index}>
						<div className="text-sm">태그 {index + 1}</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>
		</ScrollArea>
	)
} satisfies Meta<ScrollAreaStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		height: 192,
		itemCount: 20,
		heading: '태그'
	}
}
