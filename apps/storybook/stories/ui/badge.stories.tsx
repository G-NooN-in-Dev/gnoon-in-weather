import { Badge } from '@shared/ui/badge'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

const meta = {
	title: 'UI/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		children: textArgType('배지 텍스트'),
		variant: selectArgType(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'], '배지 스타일 변형')
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
