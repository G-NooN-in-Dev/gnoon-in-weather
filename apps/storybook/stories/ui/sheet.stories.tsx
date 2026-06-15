import { Button } from '@shared/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	sheetSideOptions,
	SheetTitle,
	SheetTrigger
} from '@shared/ui/sheet'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type SheetStoryArgs = {
	open: boolean
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
		open: booleanArgType('열림 상태'),
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('시트 제목'),
		description: textArgType('시트 설명'),
		side: selectArgType(sheetSideOptions, '시트 방향'),
		showCloseButton: booleanArgType('닫기 버튼 표시')
	},
	render: function Render({ open, triggerLabel, title, description, side, showCloseButton }: SheetStoryArgs) {
		const { setArg } = useArgSync<SheetStoryArgs>()

		return (
			<Sheet
				open={open}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
			>
				<SheetTrigger render={<Button variant="outline" />}>{triggerLabel}</SheetTrigger>
				<SheetContent side={side} showCloseButton={showCloseButton}>
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<SheetDescription>{description}</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		)
	}
} satisfies Meta<SheetStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		open: false,
		triggerLabel: 'Sheet 열기',
		title: '편집',
		description: '프로필 정보를 수정합니다.',
		side: 'right',
		showCloseButton: true
	}
}

export const Left: Story = {
	args: { ...Default.args, side: 'left', triggerLabel: '왼쪽 Sheet' }
}

export const Top: Story = {
	args: { ...Default.args, side: 'top', triggerLabel: '위쪽 Sheet' }
}

export const NoCloseButton: Story = {
	args: { ...Default.args, showCloseButton: false, triggerLabel: '닫기 버튼 없음' }
}
