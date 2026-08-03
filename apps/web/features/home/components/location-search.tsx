'use client'

import { Input } from '@shared/ui/input'
import { Spinner } from '@shared/ui/spinner'
import { cn } from '@shared/ui/utils'
import { Search } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import { buildKakaoApiUrl } from '@/lib/kakao/api-url'
import { KAKAO_SEARCH_DEBOUNCE_MS, KAKAO_SEARCH_MIN_QUERY_LENGTH } from '@/lib/kakao/constants'
import type { AppApiError } from '@/types/error.type'
import type { LocationSearchItem, LocationSearchResponse } from '@/types/kakao-local.type'

type LocationSearchProps = {
	/** 목록에서 장소를 고르면 호출 — 홈에서 useWeather.selectLocation에 연결합니다. */
	onSelect: (item: LocationSearchItem) => void
	className?: string
}

/**
 * 카카오 Local 기반 위치 검색창.
 * 입력 debounce 후 /api/kakao/search를 호출하고, 선택 시 좌표·라벨을 상위로 넘깁니다.
 *
 * 짧은 검색어로 결과를 비울 때는 effect에서 동기 setState 하지 않고,
 * onChange(이벤트)에서 리셋합니다. effect는 debounce·fetch(외부 시스템)만 담당합니다.
 */
function LocationSearch({ onSelect, className }: LocationSearchProps) {
	const listId = useId()
	const [query, setQuery] = useState('')
	const [items, setItems] = useState<LocationSearchItem[]>([])
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	const trimmedQuery = query.trim()
	const canSearch = trimmedQuery.length >= KAKAO_SEARCH_MIN_QUERY_LENGTH

	useEffect(() => {
		// 최소 글자 미만이면 fetch하지 않음. 결과 리셋은 onChange에서 처리.
		if (!canSearch) {
			return
		}

		const controller = new AbortController()
		const timer = window.setTimeout(() => {
			void (async () => {
				setLoading(true)
				setErrorMessage(null)

				try {
					const response = await fetch(buildKakaoApiUrl('search', { q: trimmedQuery }), {
						signal: controller.signal
					})
					const data = await response.json()

					if (!response.ok) {
						const apiError = data.error as AppApiError | undefined
						setItems([])
						setErrorMessage(apiError?.message ?? '위치 검색에 실패했습니다.')
						setIsOpen(true)
						return
					}

					const { items: nextItems } = data as LocationSearchResponse
					setItems(nextItems)
					setIsOpen(true)
				} catch (error) {
					if (error instanceof DOMException && error.name === 'AbortError') {
						return
					}

					setItems([])
					setErrorMessage('위치 검색 중 오류가 발생했습니다.')
					setIsOpen(true)
				} finally {
					if (!controller.signal.aborted) {
						setLoading(false)
					}
				}
			})()
		}, KAKAO_SEARCH_DEBOUNCE_MS)

		return () => {
			window.clearTimeout(timer)
			controller.abort()
		}
	}, [canSearch, trimmedQuery])

	function handleQueryChange(nextQuery: string) {
		setQuery(nextQuery)
		setIsOpen(true)

		// 이벤트 핸들러에서의 setState는 cascading render 규칙 대상이 아님
		if (nextQuery.trim().length < KAKAO_SEARCH_MIN_QUERY_LENGTH) {
			setItems([])
			setLoading(false)
			setErrorMessage(null)
		}
	}

	function handleSelect(item: LocationSearchItem) {
		onSelect(item)
		setQuery(item.label)
		setIsOpen(false)
		setItems([])
		setErrorMessage(null)
		setLoading(false)
	}

	const showPanel = isOpen && canSearch

	return (
		<section className={cn('relative flex flex-col gap-2', className)} aria-label="위치 검색">
			<div className="relative">
				<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
				<Input
					type="search"
					value={query}
					placeholder="장소·주소 검색"
					autoComplete="off"
					aria-autocomplete="list"
					aria-controls={listId}
					aria-expanded={showPanel}
					onChange={(event) => {
						handleQueryChange(event.target.value)
					}}
					onFocus={() => {
						if (canSearch && (items.length > 0 || errorMessage)) {
							setIsOpen(true)
						}
					}}
					onBlur={() => {
						// 항목 클릭이 blur보다 먼저 처리되도록 짧게 지연합니다.
						window.setTimeout(() => setIsOpen(false), 150)
					}}
					className="pl-9"
				/>
				{loading ? <Spinner className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2" /> : null}
			</div>

			{showPanel ? (
				<ul
					id={listId}
					role="listbox"
					className="border-border bg-popover absolute top-full z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border py-1 shadow-md"
				>
					{loading && items.length === 0 ? <li className="text-muted-foreground px-3 py-2 text-sm">검색 중…</li> : null}
					{errorMessage ? <li className="text-destructive px-3 py-2 text-sm">{errorMessage}</li> : null}
					{!loading && !errorMessage && items.length === 0 ? (
						<li className="text-muted-foreground px-3 py-2 text-sm">검색 결과가 없습니다.</li>
					) : null}
					{items.map((item) => (
						<li key={item.id} role="option">
							<button
								type="button"
								className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-left text-sm"
								onMouseDown={(event) => {
									// blur로 패널이 닫히기 전에 선택을 확정합니다.
									event.preventDefault()
									handleSelect(item)
								}}
							>
								<span className="font-medium">{item.label}</span>
								{item.address ? <span className="text-muted-foreground text-xs">{item.address}</span> : null}
							</button>
						</li>
					))}
				</ul>
			) : null}
		</section>
	)
}

export default LocationSearch
