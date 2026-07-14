'use client'

import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react'

type UseHorizontalDragScrollOptions = {
	/** 스크롤 비율 (0~1) */
	scrollRatio?: number
}

/**
 * 수평 스크롤 영역에서 드래그(마우스·터치)로 스크롤 이동을 제어하는 커스텀 훅입니다.
 *
 * 주요 동작/역할:
 * - 마우스 드래그로 리스트를 자연스럽게 좌우 이동할 수 있게 해줍니다.
 * - 스크롤 가능한 이전/다음 영역이 있는지 판별해 좌우 화살표 UI(버튼) show/hide 등에 활용할 수 있습니다.
 * - 외부에서 ref로 스크롤 div를 제어하거나, 버튼 클릭 시 일정 비율만큼 이동도 지원합니다.
 *
 * 사용 맥락:
 * - 카드 슬라이드, 가로 리스트(예: 시간대별 날씨, 카테고리 탭 등) UI에서,
 *   스크롤바 없이 드래그·버튼 둘 다 지원하고 싶을 때 사용합니다.
 *
 * 반환 값:
 * - scrollRef: 스크롤 타깃 영역에 ref로 할당
 * - scrollProps: pointer 이벤트 및 필요한 기타 props 묶음 (div 등에 spread)
 * - canScrollPrev/Next: 이전/다음으로 스크롤 가능한지 여부
 * - scrollByAmount: (화살표 버튼 등에서) 원하는 방향(1 | -1)으로 부드럽게 스크롤 이동
 *
 */

function useHorizontalDragScroll({ scrollRatio = 0.8 }: UseHorizontalDragScrollOptions = {}) {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	const dragState = useRef({ isDown: false, startX: 0, startScrollLeft: 0 })

	const updateScrollState = useCallback(() => {
		const scrollElement = scrollRef.current
		if (!scrollElement) return

		const { scrollLeft, scrollWidth, clientWidth } = scrollElement

		setCanScrollPrev(scrollLeft > 0)
		setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1)
	}, [])

	const scrollByAmount = useCallback(
		(direction: 1 | -1) => {
			const scrollElement = scrollRef.current
			if (!scrollElement) return

			const { clientWidth } = scrollElement

			scrollElement.scrollBy({ left: direction * clientWidth * scrollRatio, behavior: 'smooth' })
		},
		[scrollRatio]
	)

	const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0) return

		const scrollElement = scrollRef.current
		if (!scrollElement) return

		e.preventDefault()

		const { scrollLeft } = scrollElement

		dragState.current = { isDown: true, startX: e.clientX, startScrollLeft: scrollLeft }

		scrollElement.setPointerCapture(e.pointerId)
	}, [])

	const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
		const scrollElement = scrollRef.current
		const dragStateElement = dragState.current
		if (!scrollElement || !dragStateElement.isDown) return

		const { startX, startScrollLeft } = dragStateElement

		scrollElement.scrollLeft = startScrollLeft - (e.clientX - startX)
	}, [])

	const onPointerUp = useCallback(() => {
		dragState.current.isDown = false
	}, [])

	useEffect(() => {
		const scrollElement = scrollRef.current
		if (!scrollElement) return

		updateScrollState()

		const resizeObserver = new ResizeObserver(() => {
			updateScrollState()
		})

		resizeObserver.observe(scrollElement)

		const contentElement = scrollElement.firstElementChild
		if (contentElement) {
			resizeObserver.observe(contentElement)
		}

		window.addEventListener('resize', updateScrollState)

		return () => {
			resizeObserver.disconnect()
			window.removeEventListener('resize', updateScrollState)
		}
	}, [updateScrollState])

	return {
		scrollRef,
		canScrollPrev,
		canScrollNext,
		updateScrollState,
		scrollByAmount,
		scrollProps: {
			onScroll: updateScrollState,
			onPointerDown,
			onPointerMove,
			onPointerUp,
			onPointerCancel: onPointerUp,
			className: 'touch-pan-x overflow-x-auto select-none scrollbar-none'
		}
	}
}

export default useHorizontalDragScroll
