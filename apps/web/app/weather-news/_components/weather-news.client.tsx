'use client'

import { useState } from 'react'

import { useWeatherNews } from '@/features/weather-news/hooks/use-weather-news'
import NewsFeedSection from '@/features/weather-news/sections/news-feed.section'
import PressFilterSection from '@/features/weather-news/sections/press-filter.section'
import type { WeatherNewsClientProps } from '@/features/weather-news/types/weather-news-component.type'
import type { PressEntry } from '@/lib/naver/broadcast-press-list'
import { filterNewsBySelectedPress } from '@/lib/naver/filter-naver-news'

const MAX_PRESS_SELECTION = 5

/**
 * 날씨 뉴스 페이지 client 조합기.
 * 좌측 피드 + 우측 언론사 필터(최대 5개, 선택 즉시 반영).
 */
function WeatherNewsClient({ initialPage, initialError }: WeatherNewsClientProps) {
	const { items, hasMore, loadingMore, error, loadMore } = useWeatherNews({
		initialPage,
		initialError
	})
	const [selectedPresses, setSelectedPresses] = useState<PressEntry[]>([])

	const isFiltered = selectedPresses.length > 0
	const filteredItems = filterNewsBySelectedPress(
		items,
		selectedPresses.map((press) => press.domain)
	)

	function handleToggle(press: PressEntry) {
		const { domain } = press

		setSelectedPresses((prev) => {
			if (prev.some((item) => item.domain === domain)) {
				return prev.filter((item) => item.domain !== domain)
			}

			if (prev.length >= MAX_PRESS_SELECTION) {
				return prev
			}

			return [...prev, press]
		})
	}

	function handleRemove(domain: string) {
		setSelectedPresses((prev) => prev.filter((item) => item.domain !== domain))
	}

	function handleReset() {
		setSelectedPresses([])
	}

	return (
		<div className="flex gap-10">
			<div className="flex w-2/3 flex-col">
				<NewsFeedSection
					items={filteredItems}
					loadedCount={items.length}
					isFiltered={isFiltered}
					hasMore={hasMore}
					loadingMore={loadingMore}
					errorMessage={error?.message || null}
					onLoadMore={loadMore}
				/>
			</div>
			<aside className="w-1/3 shrink-0">
				<div className="sticky top-6">
					<PressFilterSection
						selectedPresses={selectedPresses}
						maxSelection={MAX_PRESS_SELECTION}
						onToggle={handleToggle}
						onRemove={handleRemove}
						onReset={handleReset}
					/>
				</div>
			</aside>
		</div>
	)
}

export default WeatherNewsClient
