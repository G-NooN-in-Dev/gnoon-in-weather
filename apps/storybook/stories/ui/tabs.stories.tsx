import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

type TabsStoryArgs = {
	defaultValue: string
	firstLabel: string
	firstContent: string
	secondLabel: string
	secondContent: string
}

const meta = {
	title: 'UI/Tabs',
	tags: ['autodocs'],
	argTypes: {
		defaultValue: selectArgType(['account', 'password'], '초기 선택 탭'),
		firstLabel: textArgType('첫 번째 탭 라벨'),
		firstContent: textArgType('첫 번째 탭 내용'),
		secondLabel: textArgType('두 번째 탭 라벨'),
		secondContent: textArgType('두 번째 탭 내용')
	},
	render: ({ defaultValue, firstLabel, firstContent, secondLabel, secondContent }) => (
		<Tabs defaultValue={defaultValue} className="w-[400px]">
			<TabsList>
				<TabsTrigger value="account">{firstLabel}</TabsTrigger>
				<TabsTrigger value="password">{secondLabel}</TabsTrigger>
			</TabsList>
			<TabsContent value="account">{firstContent}</TabsContent>
			<TabsContent value="password">{secondContent}</TabsContent>
		</Tabs>
	)
} satisfies Meta<TabsStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		defaultValue: 'account',
		firstLabel: '계정',
		firstContent: '계정 설정 내용',
		secondLabel: '비밀번호',
		secondContent: '비밀번호 변경 내용'
	}
}
