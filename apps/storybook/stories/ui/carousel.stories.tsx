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
		<Carousel className="mx-auto w-full max-w-xs" opts={{ loop }}>
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
