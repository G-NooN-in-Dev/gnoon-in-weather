import { NextRequest, NextResponse } from 'next/server'

import { isAppApiError } from '@/lib/api-error'
import { WEATHER_INVALID_COORDINATES_ERROR } from '@/lib/weather/api-route-errors'
import { parseWeatherFetchParams } from '@/lib/weather/parse-api-query'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'

async function GET(request: NextRequest) {
	const params = parseWeatherFetchParams(request.nextUrl.searchParams)

	if (!params) {
		return NextResponse.json({ error: WEATHER_INVALID_COORDINATES_ERROR }, { status: 400 })
	}

	// 클라이언트가 stale SSR 데이터를 알고 전체 재조회할 때 캐시를 우회합니다.
	const fresh = request.nextUrl.searchParams.get('fresh') === 'true'

	try {
		const summary = await loadWeatherSummary(params, fresh ? { fresh: true } : undefined)

		return NextResponse.json(summary)
	} catch (error) {
		if (isAppApiError(error)) {
			return NextResponse.json({ error }, { status: error.status })
		}

		// 환경 변수 미설정 등 서비스 외부 예외
		const internalError: AppApiError = {
			provider: 'weatherapi',
			code: 0,
			key: 'WEATHER_INTERNAL_ERROR',
			status: 500,
			retryable: true,
			message: error instanceof Error ? error.message : '날씨 정보를 불러오는 중 오류가 발생했습니다.'
		}

		return NextResponse.json({ error: internalError }, { status: 500 })
	}
}

export { GET }
