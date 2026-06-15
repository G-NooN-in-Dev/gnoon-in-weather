import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type CardStoryArgs = {
	title: string
	description: string
	content: string
	footerLabel: string
}

const meta = {
	title: 'UI/Card',
	tags: ['autodocs'],
	argTypes: {
		title: textArgType('카드 제목'),
		description: textArgType('카드 설명'),
		content: textArgType('카드 본문'),
		footerLabel: textArgType('푸터 버튼 텍스트')
	},
	render: ({ title, description, content, footerLabel }) => (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{content}</p>
			</CardContent>
			<CardFooter>
				<Button>{footerLabel}</Button>
			</CardFooter>
		</Card>
	)
} satisfies Meta<CardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		title: '카드 제목',
		description: '카드 설명 텍스트입니다.',
		content: '본문 콘텐츠 영역입니다.',
		footerLabel: '확인'
	}
}
