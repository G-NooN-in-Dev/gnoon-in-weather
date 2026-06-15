import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '@shared/ui/popover'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type PopoverStoryArgs = {
	triggerLabel: string
	title: string
	description: string
	inputLabel: string
	inputValue: string
}

const meta = {
	title: 'UI/Popover',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('팝오버 제목'),
		description: textArgType('팝오버 설명'),
		inputLabel: textArgType('입력 필드 라벨'),
		inputValue: textArgType('입력 필드 기본값')
	},
	render: ({ triggerLabel, title, description, inputLabel, inputValue }) => (
		<Popover>
			<PopoverTrigger render={<Button variant="outline" />}>{triggerLabel}</PopoverTrigger>
			<PopoverContent className="w-80">
				<PopoverHeader>
					<PopoverTitle>{title}</PopoverTitle>
					<PopoverDescription>{description}</PopoverDescription>
				</PopoverHeader>
				<div className="grid gap-2">
					<Label htmlFor="popover-width">{inputLabel}</Label>
					<Input id="popover-width" defaultValue={inputValue} />
				</div>
			</PopoverContent>
		</Popover>
	)
} satisfies Meta<PopoverStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: '열기',
		title: '크기',
		description: '레이어 크기를 설정합니다.',
		inputLabel: '너비',
		inputValue: '100%'
	}
}
