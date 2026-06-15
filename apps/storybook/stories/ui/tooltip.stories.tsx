import { Button } from '@shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/tooltip'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type TooltipStoryArgs = {
	triggerLabel: string
	content: string
}

const meta = {
	title: 'UI/Tooltip',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		content: textArgType('툴팁 내용')
	},
	render: ({ triggerLabel, content }) => (
		<Tooltip>
			<TooltipTrigger render={<Button variant="outline" />}>{triggerLabel}</TooltipTrigger>
			<TooltipContent>{content}</TooltipContent>
		</Tooltip>
	)
} satisfies Meta<TooltipStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: '마우스를 올려보세요',
		content: '도움말 텍스트입니다.'
	}
}
