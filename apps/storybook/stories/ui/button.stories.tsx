import { Button } from '@shared/ui/button'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'

const meta = {
	title: 'UI/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		children: textArgType('버튼 텍스트'),
		variant: selectArgType(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'], '버튼 스타일 변형'),
		size: selectArgType(['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'], '버튼 크기'),
		disabled: booleanArgType('비활성화 여부')
	}
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: 'Button',
		variant: 'default',
		size: 'default'
	}
}

export const Outline: Story = {
	args: { children: 'Outline', variant: 'outline' }
}

export const Secondary: Story = {
	args: { children: 'Secondary', variant: 'secondary' }
}

export const Ghost: Story = {
	args: { children: 'Ghost', variant: 'ghost' }
}

export const Destructive: Story = {
	args: { children: 'Delete', variant: 'destructive' }
}

export const Link: Story = {
	args: { children: 'Link', variant: 'link' }
}

export const Icon: Story = {
	args: {
		children: '★',
		size: 'icon',
		'aria-label': '즐겨찾기'
	}
}

export const Disabled: Story = {
	args: {
		children: 'Disabled',
		disabled: true
	}
}
