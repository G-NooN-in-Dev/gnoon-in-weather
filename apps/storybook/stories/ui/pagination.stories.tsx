import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@shared/ui/pagination'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { rangeArgType } from './_arg-types'

type PaginationStoryArgs = {
	activePage: number
	totalPages: number
}

const meta = {
	title: 'UI/Pagination',
	tags: ['autodocs'],
	argTypes: {
		activePage: rangeArgType(1, 5, 1, '현재 페이지'),
		totalPages: rangeArgType(3, 10, 1, '전체 페이지 수')
	},
	render: ({ activePage, totalPages }) => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				{Array.from({ length: totalPages }).map((_, index) => {
					const page = index + 1

					return (
						<PaginationItem key={page}>
							<PaginationLink href="#" isActive={page === activePage}>
								{page}
							</PaginationLink>
						</PaginationItem>
					)
				})}
				{totalPages > 5 ? (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				) : null}
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
} satisfies Meta<PaginationStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		activePage: 2,
		totalPages: 3
	}
}
