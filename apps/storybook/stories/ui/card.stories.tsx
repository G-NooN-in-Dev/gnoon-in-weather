import { Button } from '@shared/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	cardSizeOptions,
	CardTitle
} from '@shared/ui/card'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

type CardStoryArgs = {
	size: 'default' | 'sm'
	title: string
	description: string
	content: string
	footerLabel: string
}

const meta = {
	title: 'UI/Card',
	component: Card,
	tags: ['autodocs'],
	argTypes: {
		size: selectArgType(cardSizeOptions, '카드 크기'),
		title: textArgType('카드 제목'),
		description: textArgType('카드 설명'),
		content: textArgType('카드 본문'),
		footerLabel: textArgType('푸터 버튼 텍스트')
	},
	render: ({ size, title, description, content, footerLabel }) => (
		<Card size={size} className="w-full max-w-sm">
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
		size: 'default',
		title: '카드 제목',
		description: '카드 설명 텍스트입니다.',
		content: '본문 콘텐츠 영역입니다.',
		footerLabel: '확인'
	}
}

export const Small: Story = {
	args: {
		size: 'sm',
		title: '카드 제목',
		description: '카드 설명 텍스트입니다.',
		content: '본문 콘텐츠 영역입니다.',
		footerLabel: '확인'
	}
}

export const WithAction: Story = {
	args: Default.args,
	render: () => (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>카드 제목</CardTitle>
				<CardDescription>헤더 우측에 액션을 배치할 수 있습니다.</CardDescription>
				<CardAction>
					<Button variant="ghost" size="sm">
						더보기
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>본문 콘텐츠 영역입니다.</p>
			</CardContent>
		</Card>
	)
}
