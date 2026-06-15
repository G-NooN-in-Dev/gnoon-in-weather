import { Calendar } from '@shared/ui/calendar'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, selectArgType } from './_arg-types'

type CalendarStoryArgs = {
	showOutsideDays: boolean
	captionLayout: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
	buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
}

const meta = {
	title: 'UI/Calendar',
	tags: ['autodocs'],
	argTypes: {
		showOutsideDays: booleanArgType('이전/다음 달 날짜 표시'),
		captionLayout: selectArgType(['label', 'dropdown', 'dropdown-months', 'dropdown-years'], '캡션 레이아웃'),
		buttonVariant: selectArgType(
			['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
			'날짜 버튼 variant'
		)
	},
	render: ({ showOutsideDays, captionLayout, buttonVariant }) => (
		<Calendar
			mode="single"
			showOutsideDays={showOutsideDays}
			captionLayout={captionLayout}
			buttonVariant={buttonVariant}
			className="rounded-md border"
		/>
	)
} satisfies Meta<CalendarStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		showOutsideDays: true,
		captionLayout: 'label',
		buttonVariant: 'ghost'
	}
}
