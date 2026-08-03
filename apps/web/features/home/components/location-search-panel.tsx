'use client'

import type { ReactNode } from 'react'

type LocationSearchPanelProps = {
	listId: string
	/** 패널 상단 제목 (검색 결과 / 최근 검색) */
	title: string
	onClose: () => void
	/** 제목 오른쪽·닫기 버튼 왼쪽에 두는 추가 액션 (전체 삭제 등) */
	headerExtra?: ReactNode
	children: ReactNode
}

/**
 * 검색 결과·최근 검색이 공유하는 드롭다운 패널 껍데기.
 * 헤더(제목·닫기)와 본문 슬롯만 담당합니다.
 */
function LocationSearchPanel({ listId, title, onClose, headerExtra, children }: LocationSearchPanelProps) {
	return (
		<div
			id={listId}
			className="border-border bg-popover absolute top-full z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border shadow-md"
		>
			<div className="border-border flex items-center justify-between gap-2 border-b px-3 py-1.5">
				<span className="text-muted-foreground text-xs font-medium">{title}</span>
				<div className="flex items-center gap-3">
					{headerExtra}
					<button
						type="button"
						className="text-muted-foreground hover:text-foreground cursor-pointer text-xs underline-offset-2 hover:underline"
						onMouseDown={(event) => {
							// blur로 패널이 닫히기 전에 닫기를 확정합니다.
							event.preventDefault()
							onClose()
						}}
					>
						닫기
					</button>
				</div>
			</div>
			{children}
		</div>
	)
}

export default LocationSearchPanel
