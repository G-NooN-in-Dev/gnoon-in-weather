import { Button } from '@shared/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@shared/ui/hover-card'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { alignArgType, sideArgType, textArgType } from './_arg-types'

type HoverCardStoryArgs = {
	triggerLabel: string
	name: string
	description: string
	side: 'top' | 'right' | 'bottom' | 'left'
	align: 'start' | 'center' | 'end'
}

const meta = {
	title: 'UI/HoverCard',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		name: textArgType('카드 제목'),
		description: textArgType('카드 설명'),
		side: sideArgType('호버 카드 방향'),
		align: alignArgType('호버 카드 정렬')
	},
	render: ({ triggerLabel, name, description, side, align }) => (
		<HoverCard>
			<HoverCardTrigger render={<Button variant="link" />}>{triggerLabel}</HoverCardTrigger>
			<HoverCardContent className="w-64" side={side} align={align}>
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
		description: '공통 UI 컴포넌트를 만듭니다.',
		side: 'bottom',
		align: 'center'
	}
}

export const Top: Story = {
	args: { ...Default.args, side: 'top', triggerLabel: '위쪽 호버 카드' }
}
