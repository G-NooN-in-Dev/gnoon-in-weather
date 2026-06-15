import { Button } from '@shared/ui/button'
import { toast } from '@shared/ui/sonner'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'
import { withToaster } from './_decorators'

type SonnerStoryArgs = {
	buttonLabel: string
	message: string
	variant: 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading'
}

const meta = {
	title: 'UI/Sonner',
	tags: ['autodocs'],
	decorators: [withToaster],
	argTypes: {
		buttonLabel: textArgType('버튼 텍스트'),
		message: textArgType('토스트 메시지'),
		variant: selectArgType(
			['default', 'success', 'error', 'info', 'warning', 'loading'],
			'토스트 유형 (@shared/ui/sonner 아이콘 기준)'
		)
	},
	render: ({ buttonLabel, message, variant }) => (
		<Button
			onClick={() => {
				if (variant === 'success') toast.success(message)
				else if (variant === 'error') toast.error(message)
				else if (variant === 'info') toast.info(message)
				else if (variant === 'warning') toast.warning(message)
				else if (variant === 'loading') toast.loading(message)
				else toast(message)
			}}
		>
			{buttonLabel}
		</Button>
	)
} satisfies Meta<SonnerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		buttonLabel: '토스트 표시',
		message: '저장되었습니다',
		variant: 'default'
	}
}

export const Success: Story = {
	args: {
		buttonLabel: '성공 토스트',
		message: '변경 사항이 저장되었습니다',
		variant: 'success'
	}
}

export const Error: Story = {
	args: {
		buttonLabel: '오류 토스트',
		message: '요청을 처리하지 못했습니다',
		variant: 'error'
	}
}

export const Info: Story = {
	args: {
		buttonLabel: '정보 토스트',
		message: '새 업데이트가 있습니다',
		variant: 'info'
	}
}

export const Warning: Story = {
	args: {
		buttonLabel: '경고 토스트',
		message: '저장되지 않은 변경 사항이 있습니다',
		variant: 'warning'
	}
}

export const Loading: Story = {
	args: {
		buttonLabel: '로딩 토스트',
		message: '처리 중입니다',
		variant: 'loading'
	}
}
