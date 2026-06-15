import { Button } from '@shared/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	drawerDirectionOptions,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@shared/ui/drawer'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type DrawerStoryArgs = {
	open: boolean
	direction: 'top' | 'bottom' | 'left' | 'right'
	triggerLabel: string
	title: string
	description: string
	closeLabel: string
}

const meta = {
	title: 'UI/Drawer',
	tags: ['autodocs'],
	argTypes: {
		open: booleanArgType('열림 상태'),
		direction: selectArgType(drawerDirectionOptions, '드로어 방향 (vaul direction)'),
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('드로어 제목'),
		description: textArgType('드로어 설명'),
		closeLabel: textArgType('닫기 버튼 텍스트')
	},
	render: function Render({ open, direction, triggerLabel, title, description, closeLabel }: DrawerStoryArgs) {
		const { setArg } = useArgSync<DrawerStoryArgs>()

		return (
			<Drawer
				open={open}
				direction={direction}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
			>
				{/* vaul Trigger/Close는 button을 렌더하므로 asChild로 Button과 합성합니다. */}
				<DrawerTrigger asChild>
					<Button variant="outline">{triggerLabel}</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">{closeLabel}</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		)
	}
} satisfies Meta<DrawerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		open: false,
		direction: 'bottom',
		triggerLabel: 'Drawer 열기',
		title: '설정',
		description: '앱 설정을 변경합니다.',
		closeLabel: '닫기'
	}
}

export const Top: Story = {
	args: { ...Default.args, direction: 'top', triggerLabel: '위에서 열기' }
}

export const Left: Story = {
	args: { ...Default.args, direction: 'left', triggerLabel: '왼쪽에서 열기' }
}

export const Right: Story = {
	args: { ...Default.args, direction: 'right', triggerLabel: '오른쪽에서 열기' }
}
