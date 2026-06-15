import { Button } from '@shared/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@shared/ui/drawer'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type DrawerStoryArgs = {
	triggerLabel: string
	title: string
	description: string
	closeLabel: string
}

const meta = {
	title: 'UI/Drawer',
	tags: ['autodocs'],
	argTypes: {
		triggerLabel: textArgType('트리거 버튼 텍스트'),
		title: textArgType('드로어 제목'),
		description: textArgType('드로어 설명'),
		closeLabel: textArgType('닫기 버튼 텍스트')
	},
	render: ({ triggerLabel, title, description, closeLabel }) => (
		<Drawer>
			<DrawerTrigger>
				<Button variant="outline">{triggerLabel}</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<DrawerClose>
						<Button variant="outline">{closeLabel}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
} satisfies Meta<DrawerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		triggerLabel: 'Drawer 열기',
		title: '설정',
		description: '앱 설정을 변경합니다.',
		closeLabel: '닫기'
	}
}
