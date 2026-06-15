import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'

type SheetStoryArgs = {
	triggerLabel: string
	title: string
	description: string
	side: 'top' | 'right' | 'bottom' | 'left'
	showCloseButton: boolean
}

const meta = {
	title: 'UI/Sheet',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('시트 제목'),
		description: textArgType('시트 설명'),
		side: selectArgType(['top', 'right', 'bottom', 'left'], '시트 방향'),
		showCloseButton: booleanArgType('닫기 버튼 표시')
	},
	render: ({ triggerLabel, title, description, side, showCloseButton }) => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>{triggerLabel}</SheetTrigger>
			<SheetContent side={side} showCloseButton={showCloseButton}>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>{description}</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
} satisfies Meta<SheetStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: 'Sheet 열기',
		title: '편집',
		description: '프로필 정보를 수정합니다.',
		side: 'right',
		showCloseButton: true
	}
}
