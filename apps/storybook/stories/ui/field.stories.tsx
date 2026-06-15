import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, fieldOrientationOptions } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'

type FieldStoryArgs = {
	label: string
	placeholder: string
	description: string
	errorMessage: string
	orientation: 'vertical' | 'horizontal' | 'responsive'
	invalid: boolean
}

const meta = {
	title: 'UI/Field',
	tags: ['autodocs'],
	parameters: {
		// centered 레이아웃에서 FieldGroup w-full이 캔버스 전체로 늘어나지 않도록 고정 너비를 둡니다.
		layout: 'padded'
	},
	argTypes: {
		label: textArgType('필드 라벨'),
		placeholder: textArgType('입력 placeholder'),
		description: textArgType('필드 설명'),
		errorMessage: textArgType('오류 메시지 (invalid일 때 표시)'),
		orientation: selectArgType(fieldOrientationOptions, '필드 배치 방향'),
		invalid: booleanArgType('유효성 오류 상태')
	},
	render: ({ label, placeholder, description, errorMessage, orientation, invalid }) => (
		<div className="w-full max-w-sm">
			<FieldGroup>
				<Field orientation={orientation} data-invalid={invalid || undefined}>
					<FieldLabel htmlFor="field-email">{label}</FieldLabel>
					<Input id="field-email" type="email" placeholder={placeholder} aria-invalid={invalid || undefined} />
					<FieldDescription>{description}</FieldDescription>
					{invalid ? <FieldError>{errorMessage}</FieldError> : null}
				</Field>
			</FieldGroup>
		</div>
	)
} satisfies Meta<FieldStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		label: '이메일',
		placeholder: 'you@example.com',
		description: '로그인에 사용할 이메일 주소입니다.',
		errorMessage: '유효한 이메일을 입력하세요.',
		orientation: 'vertical',
		invalid: false
	}
}

export const Horizontal: Story = {
	args: { ...Default.args, orientation: 'horizontal' }
}

export const Responsive: Story = {
	args: { ...Default.args, orientation: 'responsive' }
}

export const Invalid: Story = {
	args: { ...Default.args, invalid: true }
}
