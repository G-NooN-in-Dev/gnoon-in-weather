import { NextRequest, NextResponse } from 'next/server'

import {
	buildWeatherMapTileUrl,
	isWeatherMapLayer,
	KOREA_WEATHER_MAP_TILE_ALLOWANCE,
	type WeatherMapLayer
} from '@/lib/weather/weather-map'

const DATE_KEY_PATTERN = /^\d{8}$/
const HOUR_KEY_PATTERN = /^\d{2}$/

/**
 * WeatherAPI Weather Maps 타일 프록시.
 * 브라우저 CORS를 피하고, preview/detail 모자이크에 속한 타일만 허용합니다.
 */
async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl
	const layerParam = searchParams.get('layer') ?? ''
	const dateKey = searchParams.get('date') ?? ''
	const hourKey = searchParams.get('hour') ?? ''
	const z = Number(searchParams.get('z'))
	const x = Number(searchParams.get('x'))
	const y = Number(searchParams.get('y'))

	if (!isWeatherMapLayer(layerParam)) {
		return NextResponse.json({ error: '지원하지 않는 레이어입니다.' }, { status: 400 })
	}

	if (!DATE_KEY_PATTERN.test(dateKey) || !HOUR_KEY_PATTERN.test(hourKey)) {
		return NextResponse.json({ error: '날짜·시각 형식이 올바르지 않습니다.' }, { status: 400 })
	}

	const allowance = KOREA_WEATHER_MAP_TILE_ALLOWANCE
	const inMosaic =
		z === allowance.zoom &&
		Number.isInteger(x) &&
		Number.isInteger(y) &&
		x >= allowance.minX &&
		x <= allowance.maxX &&
		y >= allowance.minY &&
		y <= allowance.maxY

	if (!inMosaic) {
		return NextResponse.json({ error: '한반도 모자이크 범위를 벗어난 타일입니다.' }, { status: 400 })
	}

	const layer = layerParam as WeatherMapLayer
	const upstreamUrl = buildWeatherMapTileUrl(layer, dateKey, hourKey, { x, y, z })

	try {
		const upstream = await fetch(upstreamUrl, {
			headers: {
				// CDN/방화벽이 빈 UA를 막는 경우가 있어 브라우저와 비슷하게 보냅니다.
				'User-Agent': 'Mozilla/5.0 (compatible; GNooNWeather/1.0)'
			},
			// 타일은 시간대별로 고정이므로 짧게 캐시
			next: { revalidate: 300 }
		})

		if (!upstream.ok) {
			return NextResponse.json(
				{ error: `Weather Maps 타일을 가져오지 못했습니다. (${upstream.status})` },
				{ status: 502 }
			)
		}

		const bytes = await upstream.arrayBuffer()
		return new NextResponse(bytes, {
			status: 200,
			headers: {
				'Content-Type': upstream.headers.get('Content-Type') ?? 'image/png',
				'Cache-Control': 'public, max-age=300, s-maxage=300'
			}
		})
	} catch {
		return NextResponse.json({ error: 'Weather Maps 타일 요청 중 오류가 발생했습니다.' }, { status: 502 })
	}
}

export { GET }
