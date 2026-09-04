'use client'

import { cn } from '@shared/ui/utils'
import type { ReactNode } from 'react'

type ThemeMapInfoSurfaceProps = {
	/** 상단 필터 등 지도 위 컨트롤 */
	filter: ReactNode
	/** 장소 정보 패널·placeholder (모바일 하단 / md+ 우측 상단) */
	children: ReactNode
	className?: string
}

/**
 * 테마 지도 오버레이 레이아웃.
 * md 미만: 정보는 하단 비모달 sheet(지도 조작 유지). md+: 우측 상단 패널.
 * 필터는 항상 상단.
 */
function ThemeMapInfoSurface({ filter, children, className }: ThemeMapInfoSurfaceProps) {
	return (
		<>
			<div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
				<div className="pointer-events-auto w-fit">{filter}</div>
			</div>
			<div
				className={cn(
					'pointer-events-none absolute z-20',
					// 모바일: 하단 edge-to-edge sheet
					'inset-x-0 bottom-0',
					// md+: 우측 상단 플로팅 패널 위치
					'md:inset-x-auto md:top-0 md:right-0 md:bottom-auto md:w-[min(100%,20rem)] md:p-4',
					className
				)}
			>
				<div
					className={cn(
						'pointer-events-auto',
						// 모바일 bottom sheet 크롬 (오버레이 없음 → 지도 탭 가능)
						'bg-background/95 border-border rounded-t-xl border-t shadow-lg backdrop-blur-sm',
						'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
						// md+: 크롬은 children(Card)이 담당
						'md:rounded-none md:border-0 md:bg-transparent md:pb-0 md:shadow-none md:backdrop-blur-none'
					)}
				>
					<div className="bg-muted mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full md:hidden" aria-hidden />
					<div className="max-h-[80dvh] overflow-y-auto p-3 pt-2 md:max-h-none md:overflow-visible md:p-0">
						{children}
					</div>
				</div>
			</div>
		</>
	)
}

export default ThemeMapInfoSurface
