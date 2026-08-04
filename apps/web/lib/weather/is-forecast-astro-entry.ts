import type { ForecastAstroEntry } from '@/types/weather-api.type'

/** localStorage·API JSON이 ForecastAstroEntry 형태인지 런타임으로 확인합니다. */
function isForecastAstroEntry(value: unknown): value is ForecastAstroEntry {
	if (!value || typeof value !== 'object') {
		return false
	}

	const {
		date,
		date_epoch: dateEpoch,
		sunrise,
		sunset,
		moonrise,
		moonset,
		moon_phase: moonPhase,
		moon_illumination: moonIllumination,
		is_moon_up: isMoonUp,
		is_sun_up: isSunUp
	} = value as Record<string, unknown>

	return (
		typeof date === 'string' &&
		typeof dateEpoch === 'number' &&
		typeof sunrise === 'string' &&
		typeof sunset === 'string' &&
		typeof moonrise === 'string' &&
		typeof moonset === 'string' &&
		typeof moonPhase === 'string' &&
		typeof moonIllumination === 'number' &&
		typeof isMoonUp === 'number' &&
		typeof isSunUp === 'number'
	)
}

export { isForecastAstroEntry }
