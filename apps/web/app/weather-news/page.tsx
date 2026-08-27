import WeatherNewsClient from '@/app/weather-news/_components/weather-news.client'
import { isAppApiError } from '@/lib/api-error'
import { loadWeatherNews } from '@/services/naver.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage } from '@/types/naver-news.type'

async function WeatherNewsPage() {
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

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<WeatherNewsClient initialPage={initialPage} initialError={initialError} />
				</div>
			</main>
		</div>
	)
}

export default WeatherNewsPage
