import { Textarea } from '@shared/ui/textarea'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, textArgType } from './_arg-types'

const meta = {
	title: 'UI/Textarea',
	component: Textarea,
	tags: ['autodocs'],
	argTypes: {
		placeholder: textArgType('textarea placeholder'),
		disabled: booleanArgType('비활성화 여부'),
		'aria-invalid': booleanArgType('유효성 오류 스타일 표시')
	}
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		placeholder: '메모를 입력하세요',
		disabled: false,
		'aria-invalid': false
	}
}
