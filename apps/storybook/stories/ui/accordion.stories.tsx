import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { selectArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type AccordionStoryArgs = {
	value: 'none' | 'item-1' | 'item-2'
	firstTitle: string
	firstContent: string
	secondTitle: string
	secondContent: string
}

const meta = {
	title: 'UI/Accordion',
	tags: ['autodocs'],
	argTypes: {
		value: selectArgType(['none', 'item-1', 'item-2'], '펼친 섹션'),
		firstTitle: textArgType('첫 번째 섹션 제목'),
		firstContent: textArgType('첫 번째 섹션 내용'),
		secondTitle: textArgType('두 번째 섹션 제목'),
		secondContent: textArgType('두 번째 섹션 내용')
	},
	render: function Render({ value, firstTitle, firstContent, secondTitle, secondContent }: AccordionStoryArgs) {
		const { setArg } = useArgSync<AccordionStoryArgs>()

		return (
			<Accordion
				className="max-w-md"
				value={value === 'none' ? [] : [value]}
				onValueChange={(next) => {
					const expanded = Array.isArray(next) ? next[0] : undefined
					setArg('value', expanded === 'item-1' || expanded === 'item-2' ? expanded : 'none')
				}}
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>{firstTitle}</AccordionTrigger>
					<AccordionContent>{firstContent}</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>{secondTitle}</AccordionTrigger>
					<AccordionContent>{secondContent}</AccordionContent>
				</AccordionItem>
			</Accordion>
		)
	}
} satisfies Meta<AccordionStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		value: 'none',
		firstTitle: '첫 번째 섹션',
		firstContent: '아코디언 내용입니다.',
		secondTitle: '두 번째 섹션',
		secondContent: '추가 설명 텍스트입니다.'
	}
}

export const Expanded: Story = {
	args: { ...Default.args, value: 'item-1' }
}
