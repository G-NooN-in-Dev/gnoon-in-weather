'use client'

import { X } from 'lucide-react'

import type { LocationSearchItem } from '@/types/kakao-local.type'

type LocationRecentSearchesProps = {
	enabled: boolean
	items: LocationSearchItem[]
	onEnabledChange: (enabled: boolean) => void
	onSelect: (item: LocationSearchItem) => void
	onRemove: (id: string) => void
	onClear: () => void
}

/** 하단 액션 텍스트 버튼 — blur로 패널이 닫히지 않게 mousedown을 막습니다. */
const footerActionClassName =
	'text-muted-foreground hover:text-foreground cursor-pointer text-xs underline-offset-2 hover:underline'

/**
 * 최근 검색 목록·저장 on/off·삭제 UI.
 * LocationSearchPanel 본문에 넣어 검색 결과와 같은 창을 공유합니다.
 * 켜기/끄기·전체 삭제는 하단 텍스트로 둡니다.
 */
function LocationRecentSearches({
	enabled,
	items,
	onEnabledChange,
	onSelect,
	onRemove,
	onClear
}: LocationRecentSearchesProps) {
	return (
		<div>
			{!enabled ? (
				<p className="text-muted-foreground px-3 py-2 text-sm">최근 검색이 꺼져 있습니다.</p>
			) : items.length === 0 ? (
				<p className="text-muted-foreground px-3 py-2 text-sm">최근 검색 내역이 없습니다.</p>
			) : (
				<ul role="listbox" className="py-1">
					{items.map((item) => {
						const { id, label, address } = item

						return (
							<li
								key={id}
								role="option"
								className="hover:bg-accent hover:text-accent-foreground group flex items-start"
							>
								<button
									type="button"
									className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-left text-sm"
									onMouseDown={(event) => {
										event.preventDefault()
										onSelect(item)
									}}
								>
									<span className="font-medium">{label}</span>
									{address ? (
										<span className="text-muted-foreground group-hover:text-accent-foreground/80 text-xs">
											{address}
										</span>
									) : null}
								</button>
								<button
									type="button"
									aria-label={`${label} 삭제`}
									className="text-muted-foreground hover:text-foreground mt-2 mr-2 shrink-0 cursor-pointer rounded-sm p-0.5"
									onMouseDown={(event) => {
										event.preventDefault()
										onRemove(id)
									}}
								>
									<X className="size-3.5" />
								</button>
							</li>
						)
					})}
				</ul>
			)}

			{/* 패널 맨 아래 — 켜기/끄기 + 전체 삭제 */}
			<div className="border-border flex items-center gap-3 border-t px-3 py-2">
				<button
					type="button"
					className={footerActionClassName}
					onMouseDown={(event) => {
						event.preventDefault()
						onEnabledChange(!enabled)
					}}
				>
					{enabled ? '최근 검색 끄기' : '최근 검색 켜기'}
				</button>
				{enabled && items.length > 0 ? (
					<button
						type="button"
						className={footerActionClassName}
						onMouseDown={(event) => {
							event.preventDefault()
							onClear()
						}}
					>
						전체 삭제
					</button>
				) : null}
			</div>
		</div>
	)
}

export default LocationRecentSearches
