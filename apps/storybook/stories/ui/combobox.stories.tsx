import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@shared/ui/combobox'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

const frameworks = ['Next.js', 'React', 'Vue', 'Svelte']

type ComboboxStoryArgs = {
	value: string
	placeholder: string
	emptyText: string
	showTrigger: boolean
	showClear: boolean
	disabled: boolean
}

const meta = {
	title: 'UI/Combobox',
	tags: ['autodocs'],
	argTypes: {
		value: selectArgType(['', ...frameworks], '선택 값'),
		placeholder: textArgType('입력 placeholder'),
		emptyText: textArgType('결과 없음 메시지'),
		showTrigger: booleanArgType('드롭다운 트리거 버튼 표시'),
		showClear: booleanArgType('지우기 버튼 표시'),
		disabled: booleanArgType('비활성화 여부')
	},
	render: function Render({ value, placeholder, emptyText, showTrigger, showClear, disabled }: ComboboxStoryArgs) {
		const { setArg } = useArgSync<ComboboxStoryArgs>()

		return (
			<Combobox
				items={frameworks}
				value={value || null}
				onValueChange={(next) => {
					setArg('value', next ?? '')
				}}
			>
				<ComboboxInput placeholder={placeholder} showTrigger={showTrigger} showClear={showClear} disabled={disabled} />
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
	}
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: '',
		placeholder: '프레임워크 선택',
		emptyText: '결과 없음',
		showTrigger: true,
		showClear: false,
		disabled: false
	}
}

export const Disabled: Story = {
	args: { ...Default.args, disabled: true, value: 'React' }
}

export const WithClear: Story = {
	args: {
		value: 'React',
		placeholder: '프레임워크 선택',
		emptyText: '결과 없음',
		showTrigger: true,
		showClear: true,
		disabled: false
	}
}
