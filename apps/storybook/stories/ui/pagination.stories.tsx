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
import { useArgSync } from './_synced-args'

type PaginationStoryArgs = {
	activePage: number
	totalPages: number
}

/** shadcn 스타일 페이지 번호 목록 — 양끝·현재 주변만 표시하고 나머지는 ellipsis로 대체합니다. */
function getVisiblePages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1)
	}

	const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
	const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b)
	const result: Array<number | 'ellipsis'> = []

	for (let index = 0; index < sorted.length; index++) {
		const page = sorted[index]!
		const prev = sorted[index - 1]

		if (prev !== undefined && page - prev > 1) {
			result.push('ellipsis')
		}

		result.push(page)
	}

	return result
}

const meta = {
	title: 'UI/Pagination',
	tags: ['autodocs'],
	argTypes: {
		activePage: rangeArgType(1, 10, 1, '현재 페이지'),
		totalPages: rangeArgType(3, 10, 1, '전체 페이지 수')
	},
	args: {
		activePage: 2,
		totalPages: 3
	},
	render: function Render({ activePage, totalPages }: PaginationStoryArgs) {
		const { setArg } = useArgSync<PaginationStoryArgs>()
		// Controls에서 totalPages를 줄였을 때 activePage가 범위를 벗어나지 않도록 보정합니다.
		const currentPage = Math.min(activePage, totalPages)
		const visiblePages = getVisiblePages(currentPage, totalPages)

		const goToPage = (page: number) => {
			setArg('activePage', page)
		}

		return (
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={(event) => {
								event.preventDefault()
								if (currentPage > 1) goToPage(currentPage - 1)
							}}
						/>
					</PaginationItem>
					{visiblePages.map((page, index) =>
						page === 'ellipsis' ? (
							<PaginationItem key={`ellipsis-${index}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={page}>
								<PaginationLink
									href="#"
									isActive={page === currentPage}
									onClick={(event) => {
										event.preventDefault()
										goToPage(page)
									}}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						)
					)}
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={(event) => {
								event.preventDefault()
								if (currentPage < totalPages) goToPage(currentPage + 1)
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		)
	}
} satisfies Meta<PaginationStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithEllipsis: Story = {
	args: {
		activePage: 5,
		totalPages: 10
	}
}
