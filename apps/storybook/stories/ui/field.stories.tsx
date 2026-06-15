import { Field, FieldDescription, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'

type FieldStoryArgs = {
	label: string
	placeholder: string
	description: string
	orientation: 'vertical' | 'horizontal' | 'responsive'
}

const meta = {
	title: 'UI/Field',
	tags: ['autodocs'],
	argTypes: {
		label: textArgType('필드 라벨'),
		placeholder: textArgType('입력 placeholder'),
		description: textArgType('필드 설명'),
		orientation: selectArgType(['vertical', 'horizontal', 'responsive'], '필드 배치 방향')
	},
	render: ({ label, placeholder, description, orientation }) => (
		<FieldGroup className="max-w-sm">
			<Field orientation={orientation}>
				<FieldLabel htmlFor="field-email">{label}</FieldLabel>
				<Input id="field-email" type="email" placeholder={placeholder} />
				<FieldDescription>{description}</FieldDescription>
			</Field>
		</FieldGroup>
	)
} satisfies Meta<FieldStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		label: '이메일',
		placeholder: 'you@example.com',
		description: '로그인에 사용할 이메일 주소입니다.',
		orientation: 'vertical'
	}
}
