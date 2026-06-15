import { Badge, badgeVariantOptions } from '@shared/ui/badge'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

const meta = {
	title: 'UI/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		children: textArgType('배지 텍스트'),
		variant: selectArgType(badgeVariantOptions, '배지 스타일 변형')
	}
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: 'Badge',
		variant: 'default'
	}
}

export const Secondary: Story = {
	args: { children: 'Secondary', variant: 'secondary' }
}

export const Destructive: Story = {
	args: { children: 'Destructive', variant: 'destructive' }
}

export const Outline: Story = {
	args: { children: 'Outline', variant: 'outline' }
}

export const Ghost: Story = {
	args: { children: 'Ghost', variant: 'ghost' }
}

export const Link: Story = {
	args: { children: 'Link', variant: 'link' }
}
