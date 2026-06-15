import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	alertDialogSizeOptions,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@shared/ui/alert-dialog'
import { Button } from '@shared/ui/button'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type AlertDialogStoryArgs = {
	open: boolean
	size: 'default' | 'sm'
	triggerLabel: string
	title: string
	description: string
	cancelLabel: string
	confirmLabel: string
}

const meta = {
	title: 'UI/AlertDialog',
	tags: ['autodocs'],
	argTypes: {
		open: booleanArgType('열림 상태'),
		size: selectArgType(alertDialogSizeOptions, '다이얼로그 크기'),
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('다이얼로그 제목'),
		description: textArgType('다이얼로그 설명'),
		cancelLabel: textArgType('취소 버튼 텍스트'),
		confirmLabel: textArgType('확인 버튼 텍스트')
	},
	render: function Render({
		open,
		size,
		triggerLabel,
		title,
		description,
		cancelLabel,
		confirmLabel
	}: AlertDialogStoryArgs) {
		const { setArg } = useArgSync<AlertDialogStoryArgs>()

		return (
			<AlertDialog
				open={open}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
			>
				<AlertDialogTrigger render={<Button variant="outline" />}>{triggerLabel}</AlertDialogTrigger>
				<AlertDialogContent size={size}>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
						<AlertDialogAction>{confirmLabel}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	}
} satisfies Meta<AlertDialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		open: false,
		size: 'default',
		triggerLabel: '삭제',
		title: '정말 삭제할까요?',
		description: '이 작업은 되돌릴 수 없습니다.',
		cancelLabel: '취소',
		confirmLabel: '삭제'
	}
}

export const Small: Story = {
	args: {
		open: false,
		size: 'sm',
		triggerLabel: '삭제',
		title: '정말 삭제할까요?',
		description: '이 작업은 되돌릴 수 없습니다.',
		cancelLabel: '취소',
		confirmLabel: '삭제'
	}
}
