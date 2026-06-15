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

import { textArgType } from './_arg-types'

type DialogStoryArgs = {
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
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('다이얼로그 제목'),
		description: textArgType('다이얼로그 설명'),
		cancelLabel: textArgType('취소 버튼 텍스트'),
		confirmLabel: textArgType('확인 버튼 텍스트')
	},
	render: ({ triggerLabel, title, description, cancelLabel, confirmLabel }) => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>{triggerLabel}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>{cancelLabel}</DialogClose>
					<Button type="submit">{confirmLabel}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
} satisfies Meta<DialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: '다이얼로그 열기',
		title: '프로필 수정',
		description: '이름과 이메일을 변경할 수 있습니다.',
		cancelLabel: '취소',
		confirmLabel: '저장'
	}
}

export const LongContent: Story = {
	args: {
		triggerLabel: '긴 내용 다이얼로그',
		title: '이용 약관',
		description: '스크롤이 필요한 긴 설명 텍스트입니다. 다이얼로그가 긴 콘텐츠를 어떻게 처리하는지 확인할 수 있습니다.',
		cancelLabel: '닫기',
		confirmLabel: '동의'
	},
	render: ({ triggerLabel, title, description, cancelLabel, confirmLabel }) => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>{triggerLabel}</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<p className="text-muted-foreground text-sm">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
				</p>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>{cancelLabel}</DialogClose>
					<Button type="submit">{confirmLabel}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
