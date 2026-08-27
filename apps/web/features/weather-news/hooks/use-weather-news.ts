'use client'

import { useRef, useState } from 'react'

import { isAppApiError } from '@/lib/api-error'
import { buildNaverNewsApiUrl } from '@/lib/naver/api-url'
import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage, WeatherNewsListItem } from '@/types/naver-news.type'

type UseWeatherNewsOptions = {
	initialPage: WeatherNewsFeedPage | null
	initialError?: AppApiError | null
}

type UseWeatherNewsResult = {
	items: WeatherNewsListItem[]
	hasMore: boolean
	loadingMore: boolean
	error: AppApiError | null
	loadMore: () => void
}

/** 이미 목록에 있는 링크는 건너뛰어 페이지 경계 중복을 줄입니다. */
function mergeNewsItems(prev: WeatherNewsListItem[], next: WeatherNewsListItem[]): WeatherNewsListItem[] {
	const seen = new Set(prev.map((item) => item.id))
	const appended = next.filter((item) => !seen.has(item.id))

	return [...prev, ...appended]
}

function toLoadError(payloadError: AppApiError | undefined): AppApiError {
	if (payloadError && isAppApiError(payloadError)) {
		return payloadError
	}

	return {
		provider: 'naver',
		code: 0,
		key: 'NAVER_INTERNAL_ERROR',
		status: 500,
		retryable: true,
		message: '뉴스를 더 불러오지 못했습니다.'
	}
}

/**
 * 날씨 뉴스 피드 훅.
 * SSR 첫 페이지를 받은 뒤, ‘더 보기’로 `/api/naver/news` 다음 페이지를 아래에 이어 붙입니다.
 */
function useWeatherNews({ initialPage, initialError = null }: UseWeatherNewsOptions): UseWeatherNewsResult {
	const [items, setItems] = useState<WeatherNewsListItem[]>(() => initialPage?.items ?? [])
	const [nextCursor, setNextCursor] = useState<string | null>(() => initialPage?.nextCursor ?? null)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<AppApiError | null>(initialError)

	const loadingRef = useRef(false)

	async function fetchNextPage(cursor: string) {
		if (loadingRef.current) {
			return
		}

		loadingRef.current = true
		setLoadingMore(true)

		try {
			const response = await fetch(buildNaverNewsApiUrl('news', { cursor }))
			const payload = (await response.json()) as WeatherNewsFeedPage & { error?: AppApiError }

			if (!response.ok) {
				setError(toLoadError(payload.error))
				return
			}

			const { items: nextItems, nextCursor: followingCursor } = payload

			setItems((prev) => mergeNewsItems(prev, nextItems))
			setNextCursor(followingCursor)
			setError(null)
		} catch {
			setError(toLoadError(undefined))
		} finally {
			loadingRef.current = false
			setLoadingMore(false)
		}
	}

	function loadMore() {
		if (!nextCursor || loadingRef.current) {
			return
		}

		void fetchNextPage(nextCursor)
	}

	return {
		items,
		hasMore: nextCursor !== null,
		loadingMore,
		error,
		loadMore
	}
}

export { useWeatherNews }
