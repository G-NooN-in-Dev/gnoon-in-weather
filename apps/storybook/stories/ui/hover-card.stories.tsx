import { Button } from '@shared/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@shared/ui/hover-card'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type HoverCardStoryArgs = {
	triggerLabel: string
	name: string
	description: string
}

const meta = {
	title: 'UI/HoverCard',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		name: textArgType('카드 제목'),
		description: textArgType('카드 설명')
	},
	render: ({ triggerLabel, name, description }) => (
		<HoverCard>
			<HoverCardTrigger render={<Button variant="link" />}>{triggerLabel}</HoverCardTrigger>
			<HoverCardContent className="w-64">
				<div className="space-y-1">
					<p className="text-sm font-medium">{name}</p>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	)
} satisfies Meta<HoverCardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: '@gnoon',
		name: 'gnoon',
		description: '공통 UI 컴포넌트를 만듭니다.'
	}
}
