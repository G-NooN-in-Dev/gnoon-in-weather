import { Alert, AlertAction, AlertDescription, AlertTitle, alertVariantOptions } from '@shared/ui/alert'
import { Button } from '@shared/ui/button'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoIcon } from 'lucide-react'

import { selectArgType, textArgType } from './_arg-types'

type AlertStoryArgs = {
	variant: 'default' | 'destructive'
	title: string
	description: string
	actionLabel: string
}

const meta = {
	title: 'UI/Alert',
	component: Alert,
	tags: ['autodocs'],
	argTypes: {
		variant: selectArgType(alertVariantOptions, '알림 스타일 변형'),
		title: textArgType('알림 제목'),
		description: textArgType('알림 설명'),
		actionLabel: textArgType('액션 버튼 텍스트')
	},
	render: ({ variant, title, description, actionLabel }) => (
		<Alert variant={variant} className="max-w-lg">
			<InfoIcon />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
			<AlertAction>
				<Button variant={variant === 'destructive' ? 'destructive' : 'outline'} size="sm">
					{actionLabel}
				</Button>
			</AlertAction>
		</Alert>
	)
} satisfies Meta<AlertStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		variant: 'default',
		title: '알림',
		description: '변경 사항이 저장되었습니다.',
		actionLabel: '확인'
	}
}

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		title: '오류',
		description: '요청을 처리하지 못했습니다.',
		actionLabel: '다시 시도'
	}
}
