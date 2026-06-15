import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	avatarSizeOptions
} from '@shared/ui/avatar'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

type AvatarStoryArgs = {
	size: 'default' | 'sm' | 'lg'
	src: string
	alt: string
	fallback: string
}

const meta = {
	title: 'UI/Avatar',
	component: Avatar,
	tags: ['autodocs'],
	argTypes: {
		size: selectArgType(avatarSizeOptions, '아바타 크기'),
		src: textArgType('이미지 URL (비우면 fallback만 표시)'),
		alt: textArgType('이미지 대체 텍스트'),
		fallback: textArgType('이미지 로드 실패 시 표시 텍스트')
	},
	render: ({ size, src, alt, fallback }) => (
		<Avatar size={size}>
			{src ? <AvatarImage src={src} alt={alt} /> : null}
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	)
} satisfies Meta<AvatarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

const defaultArgs = {
	size: 'default' as const,
	src: 'https://github.com/shadcn.png',
	alt: 'avatar',
	fallback: 'GN'
}

export const Default: Story = {
	args: defaultArgs
}

export const Fallback: Story = {
	args: { ...defaultArgs, src: '' }
}

export const Small: Story = {
	args: { ...defaultArgs, size: 'sm' }
}

export const Large: Story = {
	args: { ...defaultArgs, size: 'lg' }
}

export const WithBadge: Story = {
	args: defaultArgs,
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
			<AvatarFallback>GN</AvatarFallback>
			<AvatarBadge className="bg-emerald-500" />
		</Avatar>
	)
}

export const Group: Story = {
	args: defaultArgs,
	render: () => (
		<AvatarGroup>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="user 1" />
				<AvatarFallback>U1</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/vercel.png" alt="user 2" />
				<AvatarFallback>U2</AvatarFallback>
			</Avatar>
			<AvatarGroupCount>+3</AvatarGroupCount>
		</AvatarGroup>
	)
}
