'use client'

import type { LocationSearchItem } from '@/types/kakao-local.type'

type LocationSearchResultsProps = {
	items: LocationSearchItem[]
	loading: boolean
	errorMessage: string | null
	onSelect: (item: LocationSearchItem) => void
}

/**
 * 카카오 검색 API 결과 목록.
 * LocationSearchPanel 본문에 넣어 사용합니다.
 */
function LocationSearchResults({ items, loading, errorMessage, onSelect }: LocationSearchResultsProps) {
	return (
		<ul role="listbox" className="py-1">
			{loading && items.length === 0 ? <li className="text-muted-foreground px-3 py-2 text-sm">검색 중…</li> : null}
			{errorMessage ? <li className="text-destructive px-3 py-2 text-sm">{errorMessage}</li> : null}
			{!loading && !errorMessage && items.length === 0 ? (
				<li className="text-muted-foreground px-3 py-2 text-sm">검색 결과가 없습니다.</li>
			) : null}
			{items.map((item) => {
				const { id, label, address } = item

				return (
					<li key={id} role="option">
						<button
							type="button"
							className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-left text-sm"
							onMouseDown={(event) => {
								// blur로 패널이 닫히기 전에 선택을 확정합니다.
								event.preventDefault()
								onSelect(item)
							}}
						>
							<span className="font-medium">{label}</span>
							{address ? <span className="text-muted-foreground text-xs">{address}</span> : null}
						</button>
					</li>
				)
			})}
		</ul>
	)
}

export default LocationSearchResults
