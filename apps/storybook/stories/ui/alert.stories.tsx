import { Alert, AlertDescription, AlertTitle } from '@shared/ui/alert'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoIcon } from 'lucide-react'

import { selectArgType, textArgType } from './_arg-types'

type AlertStoryArgs = {
	variant: 'default' | 'destructive'
	title: string
	description: string
}

const meta = {
	title: 'UI/Alert',
	component: Alert,
	tags: ['autodocs'],
	argTypes: {
		variant: selectArgType(['default', 'destructive'], '알림 스타일 변형'),
		title: textArgType('알림 제목'),
		description: textArgType('알림 설명')
	},
	render: ({ variant, title, description }) => (
		<Alert variant={variant} className="max-w-lg">
			<InfoIcon />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	)
} satisfies Meta<AlertStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		variant: 'default',
		title: '알림',
		description: '변경 사항이 저장되었습니다.'
	}
}

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		title: '오류',
		description: '요청을 처리하지 못했습니다.'
	}
}
