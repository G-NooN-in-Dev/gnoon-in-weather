import { Card, CardContent } from '@shared/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@shared/ui/carousel'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { booleanArgType, rangeArgType } from './_arg-types'

type CarouselStoryArgs = {
	slideCount: number
	loop: boolean
}

const meta = {
	title: 'UI/Carousel',
	tags: ['autodocs'],
	argTypes: {
		slideCount: rangeArgType(2, 8, 1, '슬라이드 개수'),
		loop: booleanArgType('무한 루프')
	},
	render: ({ slideCount, loop }) => (
		// 이전/다음 버튼이 -left-12/-right-12에 위치하므로 고정 너비 + 좌우 패딩으로 캔버스 크기 변동을 막습니다.
		<div className="mx-auto w-full max-w-xs px-12">
			<Carousel key={slideCount} className="w-full" opts={{ loop }}>
				<CarouselContent>
					{Array.from({ length: slideCount }).map((_, index) => (
						<CarouselItem key={index}>
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<span className="text-4xl font-semibold">{index + 1}</span>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	)
} satisfies Meta<CarouselStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		slideCount: 5,
		loop: false
	}
}

export const Loop: Story = {
	args: { ...Default.args, loop: true }
}
