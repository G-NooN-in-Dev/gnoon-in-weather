import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@shared/ui/input-group'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchIcon } from 'lucide-react'

import { textArgType } from './_arg-types'

type InputGroupStoryArgs = {
	placeholder: string
}

const meta = {
	title: 'UI/InputGroup',
	tags: ['autodocs'],
	argTypes: {
		placeholder: textArgType('입력 placeholder')
	},
	render: ({ placeholder }) => (
		<InputGroup className="max-w-sm">
			<InputGroupAddon>
				<InputGroupText>
					<SearchIcon />
				</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput placeholder={placeholder} />
		</InputGroup>
	)
} satisfies Meta<InputGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		placeholder: '검색'
	}
}
