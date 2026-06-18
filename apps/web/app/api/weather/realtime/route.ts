import { NextRequest, NextResponse } from 'next/server'

import { WEATHER_INVALID_COORDINATES_ERROR } from '@/libs/weather-api-route-errors'
import { loadRealtimeWeather } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import { isAppApiError } from '@/utils/api-error'
import { parseWeatherFetchParams } from '@/utils/parse-weather-api-query'

async function GET(request: NextRequest) {
	const params = parseWeatherFetchParams(request.nextUrl.searchParams)

	if (!params) {
		return NextResponse.json({ error: WEATHER_INVALID_COORDINATES_ERROR }, { status: 400 })
	}

	const fresh = request.nextUrl.searchParams.get('fresh') === 'true'

	try {
		const realtime = await loadRealtimeWeather(params, fresh ? { fresh: true } : undefined)

		return NextResponse.json(realtime)
	} catch (error) {
		if (isAppApiError(error)) {
			return NextResponse.json({ error }, { status: error.status })
		}

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
