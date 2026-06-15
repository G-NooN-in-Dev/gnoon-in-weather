import { Input, inputTypeOptions } from '@shared/ui/input'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type InputStoryArgs = ComponentProps<typeof Input> & {
	value: string
}

const meta = {
	title: 'UI/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		value: textArgType('입력 값'),
		placeholder: textArgType('입력 필드 placeholder'),
		type: selectArgType(inputTypeOptions, 'input type'),
		disabled: booleanArgType('비활성화 여부'),
		'aria-invalid': booleanArgType('유효성 오류 스타일 표시')
	},
	render: function Render({ value, ...inputProps }: InputStoryArgs) {
		const { textChangeHandler } = useArgSync<{ value: string }>()

		return <Input {...inputProps} value={value} onChange={textChangeHandler('value')} />
	}
} satisfies Meta<InputStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: '',
		placeholder: '텍스트 입력',
		type: 'text',
		disabled: false,
		'aria-invalid': false
	}
}

export const Disabled: Story = {
	args: { ...Default.args, value: '비활성화된 값', disabled: true }
}

export const Invalid: Story = {
	args: { ...Default.args, value: '잘못된 입력', 'aria-invalid': true }
}

export const Password: Story = {
	args: { ...Default.args, type: 'password', placeholder: '비밀번호' }
}
