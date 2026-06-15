import { Button } from '@shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/tooltip'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { alignArgType, sideArgType, textArgType } from './_arg-types'

type TooltipStoryArgs = {
	triggerLabel: string
	content: string
	side: 'top' | 'right' | 'bottom' | 'left'
	align: 'start' | 'center' | 'end'
}

const meta = {
	title: 'UI/Tooltip',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		content: textArgType('툴팁 내용'),
		side: sideArgType('툴팁 방향'),
		align: alignArgType('툴팁 정렬')
	},
	render: ({ triggerLabel, content, side, align }) => (
		<Tooltip>
			<TooltipTrigger render={<Button variant="outline" />}>{triggerLabel}</TooltipTrigger>
			<TooltipContent side={side} align={align}>
				{content}
			</TooltipContent>
		</Tooltip>
	)
} satisfies Meta<TooltipStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: '마우스를 올려보세요',
		content: '도움말 텍스트입니다.',
		side: 'top',
		align: 'center'
	}
}

export const Right: Story = {
	args: { ...Default.args, side: 'right', triggerLabel: '오른쪽 툴팁' }
}
