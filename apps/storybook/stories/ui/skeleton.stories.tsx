import { Skeleton } from '@shared/ui/skeleton'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { rangeArgType } from './_arg-types'

type SkeletonStoryArgs = {
	avatarSize: number
	line1Width: number
	line2Width: number
}

const meta = {
	title: 'UI/Skeleton',
	tags: ['autodocs'],
	argTypes: {
		avatarSize: rangeArgType(32, 64, 4, '아바타 스켈레톤 크기 (px)'),
		line1Width: rangeArgType(120, 280, 10, '첫 번째 줄 너비 (px)'),
		line2Width: rangeArgType(80, 240, 10, '두 번째 줄 너비 (px)')
	},
	render: ({ avatarSize, line1Width, line2Width }) => (
		<div className="flex w-full max-w-sm items-center gap-4">
			<Skeleton className="rounded-full" style={{ width: avatarSize, height: avatarSize }} />
			<div className="space-y-2">
				<Skeleton className="h-4" style={{ width: line1Width }} />
				<Skeleton className="h-4" style={{ width: line2Width }} />
			</div>
		</div>
	)
} satisfies Meta<SkeletonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		avatarSize: 48,
		line1Width: 200,
		line2Width: 160
	}
}

export const Card: Story = {
	args: Default.args,
	render: () => (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<Skeleton className="h-31.25 w-full rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-4/5" />
				<Skeleton className="h-4 w-3/5" />
			</div>
		</div>
	)
}
