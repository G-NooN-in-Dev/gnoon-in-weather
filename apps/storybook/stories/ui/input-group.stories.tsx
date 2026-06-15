import { buttonVariantOptions } from '@shared/ui/button'
import {
	InputGroup,
	InputGroupAddon,
	inputGroupAddonAlignOptions,
	InputGroupButton,
	inputGroupButtonSizeOptions,
	InputGroupInput,
	InputGroupText
} from '@shared/ui/input-group'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchIcon } from 'lucide-react'

import { selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type InputGroupStoryArgs = {
	value: string
	placeholder: string
	addonAlign: 'inline-start' | 'inline-end' | 'block-start' | 'block-end'
	buttonSize: 'xs' | 'sm' | 'icon-xs' | 'icon-sm'
	buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
}

const meta = {
	title: 'UI/InputGroup',
	tags: ['autodocs'],
	argTypes: {
		value: textArgType('입력 값'),
		placeholder: textArgType('입력 placeholder'),
		addonAlign: selectArgType(inputGroupAddonAlignOptions, 'InputGroupAddon align'),
		buttonSize: selectArgType(inputGroupButtonSizeOptions, 'InputGroupButton 크기'),
		buttonVariant: selectArgType(buttonVariantOptions, 'InputGroupButton variant')
	},
	render: function Render({ value, placeholder, addonAlign }: InputGroupStoryArgs) {
		const { textChangeHandler } = useArgSync<InputGroupStoryArgs>()

		return (
			<InputGroup className="max-w-sm">
				<InputGroupAddon align={addonAlign}>
					<InputGroupText>
						<SearchIcon />
					</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput placeholder={placeholder} value={value} onChange={textChangeHandler('value')} />
			</InputGroup>
		)
	}
} satisfies Meta<InputGroupStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: '',
		placeholder: '검색',
		addonAlign: 'inline-start',
		buttonSize: 'xs',
		buttonVariant: 'ghost'
	}
}

export const BlockEnd: Story = {
	args: { ...Default.args, addonAlign: 'block-end', placeholder: '메모' }
}

export const WithButton: Story = {
	args: {
		value: '',
		placeholder: '검색',
		addonAlign: 'inline-end',
		buttonSize: 'xs',
		buttonVariant: 'default'
	},
	render: function Render({ value, placeholder, addonAlign, buttonSize, buttonVariant }: InputGroupStoryArgs) {
		const { textChangeHandler } = useArgSync<InputGroupStoryArgs>()

		return (
			<InputGroup className="max-w-sm">
				<InputGroupInput placeholder={placeholder} value={value} onChange={textChangeHandler('value')} />
				<InputGroupAddon align={addonAlign}>
					<InputGroupButton size={buttonSize} variant={buttonVariant}>
						검색
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		)
	}
}
