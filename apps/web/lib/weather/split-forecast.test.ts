import { describe, expect, it } from 'vitest'

import { splitForecastDays } from '@/lib/weather/split-forecast'
import type { WeatherApiForecastDay } from '@/types/weather-api.type'

function makeForecastDay(date: string, dateEpoch: number): WeatherApiForecastDay {
	return {
		date,
		date_epoch: dateEpoch,
		day: { maxtemp_c: 20 } as WeatherApiForecastDay['day'],
		astro: { sunrise: '06:00 AM' } as WeatherApiForecastDay['astro'],
		hour: [{ time: `${date} 12:00`, temp_c: 18 } as WeatherApiForecastDay['hour'][number]]
	}
}

describe('splitForecastDays', () => {
	it('day / astro / hour로 분리한다', () => {
		const days = [makeForecastDay('2026-09-10', 1_700_000_000), makeForecastDay('2026-09-11', 1_700_086_400)]

		const result = splitForecastDays(days)

		expect(result.days).toHaveLength(2)
		expect(result.days[0]).toMatchObject({ date: '2026-09-10', maxtemp_c: 20 })
		expect(result.astros).toHaveLength(2)
		expect(result.astros[0]).toMatchObject({ date: '2026-09-10', sunrise: '06:00 AM' })
		expect(result.hours).toHaveLength(2)
		expect(result.hours[0]).toMatchObject({ time: '2026-09-10 12:00', temp_c: 18 })
	})

	it('빈 배열이면 빈 결과를 반환한다', () => {
		expect(splitForecastDays([])).toEqual({ days: [], astros: [], hours: [] })
	})
})
