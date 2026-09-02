import WeatherNewsClient from '@/app/weather-news/_components/weather-news.client'
import { isAppApiError } from '@/lib/api-error'
import { loadWeatherNews } from '@/services/naver.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage } from '@/types/naver-news.type'

type WeatherNewsContentServerProps = {
	isLoggedIn: boolean
}

async function WeatherNewsContentServer({ isLoggedIn }: WeatherNewsContentServerProps) {
	let initialPage: WeatherNewsFeedPage | null = null
	let initialError: AppApiError | null = null

	try {
		initialPage = await loadWeatherNews()
	} catch (caught) {
		if (isAppApiError(caught)) {
			initialError = caught
		} else {
			initialError = {
				provider: 'naver',
				code: 0,
				key: 'NAVER_INTERNAL_ERROR',
				status: 500,
				retryable: true,
				message: caught instanceof Error ? caught.message : '네이버 뉴스 검색 중 오류가 발생했습니다.'
			}
		}
	}

	return <WeatherNewsClient isLoggedIn={isLoggedIn} initialPage={initialPage} initialError={initialError} />
}

export default WeatherNewsContentServer
