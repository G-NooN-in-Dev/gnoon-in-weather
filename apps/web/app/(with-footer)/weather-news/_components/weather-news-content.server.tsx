import WeatherNewsClient from '@/app/(with-footer)/weather-news/_components/weather-news.client'
import { isAppApiError } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth/session.server'
import { loadWeatherNewsFirstPage } from '@/services/naver.loader.cache.server'
import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage } from '@/types/naver-news.type'

type WeatherLoadResult = {
	page: WeatherNewsFeedPage | null
	error: AppApiError | null
}

async function loadWeatherNewsSafe(): Promise<WeatherLoadResult> {
	try {
		const page = await loadWeatherNewsFirstPage()

		return { page, error: null }
	} catch (caught) {
		if (isAppApiError(caught)) {
			return { page: null, error: caught }
		}

		return {
			page: null,
			error: {
				provider: 'naver',
				code: 0,
				key: 'NAVER_INTERNAL_ERROR',
				status: 500,
				retryable: true,
				message: caught instanceof Error ? caught.message : '네이버 뉴스 검색 중 오류가 발생했습니다.'
			}
		}
	}
}

async function WeatherNewsContentServer() {
	const [currentUser, { page: initialPage, error: initialError }] = await Promise.all([
		getCurrentUser(),
		loadWeatherNewsSafe()
	])

	return <WeatherNewsClient isLoggedIn={Boolean(currentUser)} initialPage={initialPage} initialError={initialError} />
}

export default WeatherNewsContentServer
