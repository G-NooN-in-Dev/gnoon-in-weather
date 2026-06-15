import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@shared/ui/combobox'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, textArgType } from './_arg-types'

const frameworks = ['Next.js', 'React', 'Vue', 'Svelte']

type ComboboxStoryArgs = {
	placeholder: string
	emptyText: string
	showClear: boolean
}

const meta = {
	title: 'UI/Combobox',
	tags: ['autodocs'],
	argTypes: {
		placeholder: textArgType('입력 placeholder'),
		emptyText: textArgType('결과 없음 메시지'),
		showClear: booleanArgType('지우기 버튼 표시')
	},
	render: ({ placeholder, emptyText, showClear }) => (
		<Combobox items={frameworks}>
			<ComboboxInput placeholder={placeholder} showClear={showClear} />
			<ComboboxContent>
				<ComboboxEmpty>{emptyText}</ComboboxEmpty>
				<ComboboxList>
					{(item) => (
						<ComboboxItem key={item} value={item}>
							{item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		placeholder: '프레임워크 선택',
		emptyText: '결과 없음',
		showClear: true
	}
}
