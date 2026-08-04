import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

import { isAppApiError } from '@/lib/api-error'
import { WEATHER_INVALID_COORDINATES_ERROR } from '@/lib/weather/api-route-errors'
import { parseCoordinates } from '@/lib/weather/parse-api-query'
import { HOME_WEATHER_LANG, loadAstronomyWeather } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

/** `YYYY-MM-DD` 형식 날짜를 검증합니다. */
function parseAstronomyDate(dateParam: string | null): string | null {
	if (!dateParam) {
		return null
	}

	if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
		return null
	}

	return dayjs(dateParam).isValid() ? dateParam : null
}

async function GET(request: NextRequest) {
	const coordinates = parseCoordinates(request.nextUrl.searchParams)
	const date = parseAstronomyDate(request.nextUrl.searchParams.get('date'))

	if (!coordinates) {
		return NextResponse.json({ error: WEATHER_INVALID_COORDINATES_ERROR }, { status: 400 })
	}

	if (!date) {
		const invalidDateError: AppApiError = {
			provider: 'weatherapi',
			code: 0,
			key: 'WEATHER_INVALID_DATE',
			status: 400,
			retryable: false,
			message: '요청 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'
		}

		return NextResponse.json({ error: invalidDateError }, { status: 400 })
	}

	const lang = request.nextUrl.searchParams.get('lang') ?? HOME_WEATHER_LANG

	try {
		const astronomy = await loadAstronomyWeather({ ...coordinates, lang }, date, { fresh: true })
		const astroEntry: ForecastAstroEntry = {
			date,
			date_epoch: dayjs(date).unix(),
			...astronomy.astronomy.astro
		}

		return NextResponse.json({ astro: astroEntry })
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
			message: error instanceof Error ? error.message : '천체 정보를 불러오는 중 오류가 발생했습니다.'
		}

		return NextResponse.json({ error: internalError }, { status: 500 })
	}
}

export { GET }
