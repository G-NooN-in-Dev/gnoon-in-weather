import { Separator } from '@shared/ui/separator'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { radioArgType } from './_arg-types'

const meta = {
	title: 'UI/Separator',
	component: Separator,
	tags: ['autodocs'],
	argTypes: {
		orientation: radioArgType(['horizontal', 'vertical'], '구분선 방향')
	},
	render: ({ orientation }) => (
		<div
			className={
				orientation === 'vertical' ? 'flex h-20 w-full max-w-md items-center gap-4' : 'w-full max-w-md space-y-4'
			}
		>
			<div className="text-sm">위 섹션</div>
			<Separator orientation={orientation} />
			<div className="text-sm">아래 섹션</div>
		</div>
	)
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		orientation: 'horizontal'
	}
}
