import { Progress, ProgressLabel, ProgressValue } from '@shared/ui/progress'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { rangeArgType, textArgType } from './_arg-types'

type ProgressStoryArgs = {
	value: number
	label: string
}

const meta = {
	title: 'UI/Progress',
	component: Progress,
	tags: ['autodocs'],
	argTypes: {
		value: rangeArgType(0, 100, 1, '진행률 (0–100)'),
		label: textArgType('진행률 라벨')
	},
	render: ({ value, label }) => (
		<Progress value={value} className="w-[60%]">
			<ProgressLabel>{label}</ProgressLabel>
			<ProgressValue />
		</Progress>
	)
} satisfies Meta<ProgressStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: 45,
		label: '진행률'
	}
}
