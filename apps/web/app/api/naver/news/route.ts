import { NextRequest, NextResponse } from 'next/server'

import { isAppApiError } from '@/lib/api-error'
import { NAVER_INVALID_CURSOR_ERROR, parseNaverNewsCursorQuery } from '@/lib/naver/parse-api-query'
import { loadWeatherNews } from '@/services/naver.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage } from '@/types/naver-news.type'

/** 날씨 뉴스 검색 프록시. 클라이언트 키는 서버에서만 사용합니다. */
async function GET(request: NextRequest) {
	const parsed = parseNaverNewsCursorQuery(request.nextUrl.searchParams)

	if (!parsed.ok) {
		return NextResponse.json({ error: NAVER_INVALID_CURSOR_ERROR }, { status: 400 })
	}

	try {
		const body = (await loadWeatherNews({ cursor: parsed.cursor })) satisfies WeatherNewsFeedPage

		return NextResponse.json(body)
	} catch (error) {
		if (isAppApiError(error)) {
			return NextResponse.json({ error }, { status: error.status })
		}

		const internalError: AppApiError = {
			provider: 'naver',
			code: 0,
			key: 'NAVER_INTERNAL_ERROR',
			status: 500,
			retryable: true,
			message: error instanceof Error ? error.message : '네이버 뉴스 검색 중 오류가 발생했습니다.'
		}

		return NextResponse.json({ error: internalError }, { status: 500 })
	}
}

export { GET }
