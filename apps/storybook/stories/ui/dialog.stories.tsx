import { Button } from '@shared/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@shared/ui/dialog'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type DialogStoryArgs = {
	open: boolean
	showCloseButton: boolean
	triggerLabel: string
	title: string
	description: string
	cancelLabel: string
	confirmLabel: string
}

const meta = {
	title: 'UI/Dialog',
	tags: ['autodocs'],
	argTypes: {
		open: booleanArgType('열림 상태'),
		showCloseButton: booleanArgType('DialogContent 닫기 버튼 표시'),
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('다이얼로그 제목'),
		description: textArgType('다이얼로그 설명'),
		cancelLabel: textArgType('취소 버튼 텍스트'),
		confirmLabel: textArgType('확인 버튼 텍스트')
	},
	render: function Render({
		open,
		showCloseButton,
		triggerLabel,
		title,
		description,
		cancelLabel,
		confirmLabel
	}: DialogStoryArgs) {
		const { setArg } = useArgSync<DialogStoryArgs>()

		return (
			<Dialog
				open={open}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
			>
				<DialogTrigger render={<Button variant="outline" />}>{triggerLabel}</DialogTrigger>
				<DialogContent showCloseButton={showCloseButton}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex-row justify-end">
						<DialogClose render={<Button variant="outline" />}>{cancelLabel}</DialogClose>
						<Button>{confirmLabel}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}
} satisfies Meta<DialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		open: false,
		showCloseButton: true,
		triggerLabel: '다이얼로그 열기',
		title: '프로필 수정',
		description: '이름과 이메일을 변경할 수 있습니다.',
		cancelLabel: '취소',
		confirmLabel: '저장'
	}
}

export const NoCloseButton: Story = {
	args: { ...Default.args, showCloseButton: false, triggerLabel: '닫기 버튼 없음' }
}

export const LongContent: Story = {
	args: {
		open: false,
		showCloseButton: true,
		triggerLabel: '긴 내용 다이얼로그',
		title: '이용 약관',
		description: '스크롤이 필요한 긴 설명 텍스트입니다. 다이얼로그가 긴 콘텐츠를 어떻게 처리하는지 확인할 수 있습니다.',
		cancelLabel: '닫기',
		confirmLabel: '동의'
	},
	render: function Render(args) {
		const { setArg } = useArgSync<DialogStoryArgs>()

		return (
			<Dialog
				open={args.open}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
			>
				<DialogTrigger render={<Button variant="outline" />}>{args.triggerLabel}</DialogTrigger>
				<DialogContent showCloseButton={args.showCloseButton}>
					<DialogHeader>
						<DialogTitle>{args.title}</DialogTitle>
						<DialogDescription>{args.description}</DialogDescription>
					</DialogHeader>
					<p className="text-muted-foreground text-sm">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
						dolore magna aliqua.
					</p>
					<DialogFooter className="flex-row justify-end">
						<DialogClose render={<Button variant="outline" />}>{args.cancelLabel}</DialogClose>
						<Button>{args.confirmLabel}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}
}
