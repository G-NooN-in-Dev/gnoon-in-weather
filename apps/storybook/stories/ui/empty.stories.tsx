import { Button } from '@shared/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InboxIcon } from 'lucide-react'

import { selectArgType, textArgType } from './_arg-types'

type EmptyStoryArgs = {
	title: string
	description: string
	actionLabel: string
	mediaVariant: 'default' | 'icon'
}

const meta = {
	title: 'UI/Empty',
	tags: ['autodocs'],
	argTypes: {
		title: textArgType('빈 상태 제목'),
		description: textArgType('빈 상태 설명'),
		actionLabel: textArgType('액션 버튼 텍스트'),
		mediaVariant: selectArgType(['default', 'icon'], '미디어 영역 스타일')
	},
	render: ({ title, description, actionLabel, mediaVariant }) => (
		<Empty className="max-w-md border">
			<EmptyHeader>
				<EmptyMedia variant={mediaVariant}>
					<InboxIcon />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button>{actionLabel}</Button>
			</EmptyContent>
		</Empty>
	)
} satisfies Meta<EmptyStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		title: '데이터가 없습니다',
		description: '새 항목을 추가해 보세요.',
		actionLabel: '항목 추가',
		mediaVariant: 'icon'
	}
}
