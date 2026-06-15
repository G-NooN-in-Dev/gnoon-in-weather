import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type AvatarStoryArgs = {
	src: string
	alt: string
	fallback: string
}

const meta = {
	title: 'UI/Avatar',
	tags: ['autodocs'],
	argTypes: {
		src: textArgType('이미지 URL (비우면 fallback만 표시)'),
		alt: textArgType('이미지 대체 텍스트'),
		fallback: textArgType('이미지 로드 실패 시 표시 텍스트')
	},
	render: ({ src, alt, fallback }) => (
		<Avatar>
			{src ? <AvatarImage src={src} alt={alt} /> : null}
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	)
} satisfies Meta<AvatarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		src: 'https://github.com/shadcn.png',
		alt: 'avatar',
		fallback: 'GN'
	}
}

export const Fallback: Story = {
	args: {
		src: '',
		alt: 'avatar',
		fallback: 'GN'
	}
}
