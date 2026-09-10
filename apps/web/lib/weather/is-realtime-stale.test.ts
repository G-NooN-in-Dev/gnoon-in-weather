import { afterEach, describe, expect, it, vi } from 'vitest'

import { REALTIME_REVALIDATE_SECONDS } from '@/lib/weather/constants'
import { isRealtimeStale } from '@/lib/weather/is-realtime-stale'
import type { WeatherSummary } from '@/types/weather-api.type'

function makeSummary(lastUpdatedEpoch: number): WeatherSummary {
	return {
		realtime: {
			location: { name: 'Seoul', region: 'Seoul', country: 'South Korea', lat: 37.5, lon: 127 },
			current: { last_updated_epoch: lastUpdatedEpoch }
		},
		forecast: {
			location: { name: 'Seoul', region: 'Seoul', country: 'South Korea', lat: 37.5, lon: 127 },
			forecast: { forecastday: [] }
		}
	} as unknown as WeatherSummary
}

describe('isRealtimeStale', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('TTL 이내면 false', () => {
		const nowSeconds = 1_700_000_000

		vi.useFakeTimers()
		vi.setSystemTime(nowSeconds * 1000)

		expect(isRealtimeStale(makeSummary(nowSeconds - REALTIME_REVALIDATE_SECONDS + 1))).toBe(false)
	})

	it('TTL을 넘기면 true', () => {
		const nowSeconds = 1_700_000_000

		vi.useFakeTimers()
		vi.setSystemTime(nowSeconds * 1000)

		expect(isRealtimeStale(makeSummary(nowSeconds - REALTIME_REVALIDATE_SECONDS - 1))).toBe(true)
	})
})
