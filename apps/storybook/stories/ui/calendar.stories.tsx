import { buttonVariantOptions } from '@shared/ui/button'
import { Calendar, calendarCaptionLayoutOptions } from '@shared/ui/calendar'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type CalendarStoryArgs = {
	selectedDate: string
	showOutsideDays: boolean
	captionLayout: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
	buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
}

const meta = {
	title: 'UI/Calendar',
	tags: ['autodocs'],
	argTypes: {
		selectedDate: textArgType('선택 날짜 (YYYY-MM-DD)'),
		showOutsideDays: booleanArgType('이전/다음 달 날짜 표시'),
		captionLayout: selectArgType(calendarCaptionLayoutOptions, '캡션 레이아웃'),
		buttonVariant: selectArgType(buttonVariantOptions, '날짜 버튼 variant')
	},
	render: function Render({ selectedDate, showOutsideDays, captionLayout, buttonVariant }: CalendarStoryArgs) {
		const { setArg } = useArgSync<CalendarStoryArgs>()
		const selected = selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined

		return (
			<Calendar
				mode="single"
				selected={selected}
				onSelect={(date) => {
					setArg('selectedDate', date ? date.toISOString().slice(0, 10) : '')
				}}
				showOutsideDays={showOutsideDays}
				captionLayout={captionLayout}
				buttonVariant={buttonVariant}
				className="rounded-md border"
			/>
		)
	}
} satisfies Meta<CalendarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		selectedDate: '2026-06-15',
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost'
	}
}

export const Dropdown: Story = {
	args: { ...Default.args, captionLayout: 'dropdown' }
}
