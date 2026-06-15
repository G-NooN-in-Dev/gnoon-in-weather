import { Input } from '@shared/ui/input'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'

const meta = {
	title: 'UI/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		placeholder: textArgType('입력 필드 placeholder'),
		type: selectArgType(['text', 'password', 'email', 'number', 'search'], 'input type'),
		disabled: booleanArgType('비활성화 여부'),
		'aria-invalid': booleanArgType('유효성 오류 스타일 표시')
	}
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		placeholder: '텍스트 입력',
		type: 'text',
		disabled: false,
		'aria-invalid': false
	}
}
