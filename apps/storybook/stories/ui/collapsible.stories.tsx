import { Button } from '@shared/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, textArgType } from './_arg-types'
import { useArgSync } from './_synced-args'

type CollapsibleStoryArgs = {
	open: boolean
	heading: string
	content: string
}

const meta = {
	title: 'UI/Collapsible',
	tags: ['autodocs'],
	argTypes: {
		open: booleanArgType('펼침 상태'),
		heading: textArgType('헤더 제목'),
		content: textArgType('펼쳐지는 내용')
	},
	render: function Render({ open, heading, content }: CollapsibleStoryArgs) {
		const { setArg } = useArgSync<CollapsibleStoryArgs>()

		return (
			<Collapsible
				open={open}
				onOpenChange={(next) => {
					setArg('open', next)
				}}
				className="w-[350px] space-y-2"
			>
				<div className="flex items-center justify-between gap-4">
					<h4 className="text-sm font-medium">{heading}</h4>
					<CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
						{open ? '닫기' : '열기'}
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="text-muted-foreground text-sm">{content}</CollapsibleContent>
			</Collapsible>
		)
	}
} satisfies Meta<CollapsibleStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		open: false,
		heading: '접기/펼치기',
		content: '추가로 표시되는 상세 내용입니다.'
	}
}

export const Open: Story = {
	args: { ...Default.args, open: true }
}
