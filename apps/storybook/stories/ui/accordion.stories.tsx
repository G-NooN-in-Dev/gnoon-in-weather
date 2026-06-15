import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { textArgType } from './_arg-types'

type AccordionStoryArgs = {
	firstTitle: string
	firstContent: string
	secondTitle: string
	secondContent: string
}

const meta = {
	title: 'UI/Accordion',
	tags: ['autodocs'],
	argTypes: {
		firstTitle: textArgType('첫 번째 섹션 제목'),
		firstContent: textArgType('첫 번째 섹션 내용'),
		secondTitle: textArgType('두 번째 섹션 제목'),
		secondContent: textArgType('두 번째 섹션 내용')
	},
	render: ({ firstTitle, firstContent, secondTitle, secondContent }) => (
		<Accordion className="max-w-md">
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
} satisfies Meta<AccordionStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		firstTitle: '첫 번째 섹션',
		firstContent: '아코디언 내용입니다.',
		secondTitle: '두 번째 섹션',
		secondContent: '추가 설명 텍스트입니다.'
	}
}
