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

import { alignArgType, booleanArgType, sideArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type PopoverStoryArgs = {
	open: boolean
	triggerLabel: string
	title: string
	description: string
	inputLabel: string
	inputValue: string
	side: 'top' | 'right' | 'bottom' | 'left'
	align: 'start' | 'center' | 'end'
}

const meta = {
	title: 'UI/Popover',
	tags: ['autodocs'],
	argTypes: {
		open: booleanArgType('열림 상태'),
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('팝오버 제목'),
		description: textArgType('팝오버 설명'),
		inputLabel: textArgType('입력 필드 라벨'),
		inputValue: textArgType('입력 필드 값'),
		side: sideArgType('팝오버 방향'),
		align: alignArgType('팝오버 정렬')
	},
	render: function Render({
		open,
		triggerLabel,
		title,
		description,
		inputLabel,
		inputValue,
		side,
		align
	}: PopoverStoryArgs) {
		const { setArg, textChangeHandler } = useArgSync<PopoverStoryArgs>()

		return (
			<Popover
				open={open}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
			>
				<PopoverTrigger render={<Button variant="outline" />}>{triggerLabel}</PopoverTrigger>
				<PopoverContent className="w-80" side={side} align={align}>
					<PopoverHeader>
						<PopoverTitle>{title}</PopoverTitle>
						<PopoverDescription>{description}</PopoverDescription>
					</PopoverHeader>
					<div className="grid gap-2">
						<Label htmlFor="popover-width">{inputLabel}</Label>
						<Input id="popover-width" value={inputValue} onChange={textChangeHandler('inputValue')} />
					</div>
				</PopoverContent>
			</Popover>
		)
	}
} satisfies Meta<PopoverStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		open: false,
		triggerLabel: '열기',
		title: '크기',
		description: '레이어 크기를 설정합니다.',
		inputLabel: '너비',
		inputValue: '100%',
		side: 'bottom',
		align: 'center'
	}
}

export const Top: Story = {
	args: { ...Default.args, side: 'top', triggerLabel: '위쪽 팝오버' }
}
