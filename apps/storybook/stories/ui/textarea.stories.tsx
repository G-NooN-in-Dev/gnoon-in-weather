import { Textarea } from '@shared/ui/textarea'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { booleanArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type TextareaStoryArgs = ComponentProps<typeof Textarea> & {
	value: string
}

const meta = {
	title: 'UI/Textarea',
	component: Textarea,
	tags: ['autodocs'],
	argTypes: {
		value: textArgType('입력 값'),
		placeholder: textArgType('textarea placeholder'),
		disabled: booleanArgType('비활성화 여부'),
		'aria-invalid': booleanArgType('유효성 오류 스타일 표시')
	},
	render: function Render({ value, ...textareaProps }: TextareaStoryArgs) {
		const { textChangeHandler } = useArgSync<{ value: string }>()

		return <Textarea {...textareaProps} value={value} onChange={textChangeHandler('value')} />
	}
} satisfies Meta<TextareaStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: '',
		placeholder: '메모를 입력하세요',
		disabled: false,
		'aria-invalid': false
	}
}

export const Disabled: Story = {
	args: { ...Default.args, value: '수정할 수 없는 메모', disabled: true }
}

export const Invalid: Story = {
	args: { ...Default.args, value: '유효하지 않은 내용', 'aria-invalid': true }
}
