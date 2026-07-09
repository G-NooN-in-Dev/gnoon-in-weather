'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'

import useHorizontalDragScroll from '@/hooks/use-horizontal-drag-scroll'

type HorizontalScrollContainerProps = {
	children: ReactNode
	className?: string
	scrollClassName?: string
	prevButtonClassName?: string
}

function HorizontalScrollContainer({
	children,
	className,
	scrollClassName = '[&_[data-slot=table-container]]:w-max [&_[data-slot=table-container]]:overflow-visible',
	prevButtonClassName
}: HorizontalScrollContainerProps) {
	const { scrollRef, canScrollPrev, canScrollNext, scrollByAmount, scrollProps } = useHorizontalDragScroll()

	return (
		<div className={cn('relative', className)}>
			{canScrollPrev && (
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="이전으로 이동"
					className={cn(
						'bg-background absolute top-1/2 z-10 -translate-y-1/2 rounded-full shadow-sm',
						prevButtonClassName ?? 'left-1'
					)}
					onClick={() => scrollByAmount(-1)}
				>
					<ChevronLeft />
				</Button>
			)}
			{canScrollNext && (
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="다음으로 이동"
					className="bg-background absolute top-1/2 right-1 z-10 -translate-y-1/2 rounded-full shadow-sm"
					onClick={() => scrollByAmount(1)}
				>
					<ChevronRight />
				</Button>
			)}
			<div ref={scrollRef} {...scrollProps} className={cn(scrollProps.className, scrollClassName)}>
				{children}
			</div>
		</div>
	)
}

export default HorizontalScrollContainer
