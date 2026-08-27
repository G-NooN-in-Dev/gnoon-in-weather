import dayjs from 'dayjs'

import { ForecastAstroEntry, WeatherApiAstro, WeatherApiHour } from '@/types/weather-api.type'

import { parseAstroDateTime } from './astro-status-utils'
import { formatHourlyTimeLabel } from './format-weather-values'

type SunStatusKind = keyof Pick<WeatherApiAstro, 'sunrise' | 'sunset'>
type HourlyTimeline = {
	kind: 'hour'
	epoch: number
	date?: string
	timeLabel: string
} & WeatherApiHour
type AstroTimeline = {
	kind: 'sunrise' | 'sunset'
	epoch: number
	date: string
	time: string
	timeLabel: string
}

type HourlyWeatherTimeline = HourlyTimeline | AstroTimeline

/** 시간 예보와 일출·일몰이 같은 epoch여도 React key가 겹치지 않도록 kind를 포함합니다. */
function getHourlyTimelineItemKey(item: Pick<HourlyWeatherTimeline, 'kind' | 'epoch'>) {
	return `${item.kind}-${item.epoch}`
}

function createAstroTimeline(astro: ForecastAstroEntry, kind: SunStatusKind) {
	const { date, sunrise, sunset } = astro
	const time = kind === 'sunrise' ? sunrise : sunset
	const parsedTime = parseAstroDateTime(date, time)

	if (!parsedTime) {
		return null
	}

	return {
		kind,
		epoch: parsedTime.unix(),
		date,
		time: parsedTime.format('HH:mm'),
		timeLabel: kind === 'sunrise' ? `일출${'\u2191'}` : `일몰${'\u2193'}`
	}
}

function createHourlyWeatherTimeline(hours: WeatherApiHour[], astros: ForecastAstroEntry[]) {
	const now = dayjs()
	const baseDate = astros[0]?.date ?? hours[0]?.time.split(' ')[0] ?? now.format('YYYY-MM-DD')
	const baseHourEpoch = now.startOf('hour').unix()

	const hourTimeline = hours.map((hour) => {
		const { time, time_epoch, ...rest } = hour
		const date = time.split(' ')[0]

		return {
			kind: 'hour' as const,
			epoch: time_epoch,
			date,
			timeLabel: formatHourlyTimeLabel(hour, baseDate),
			time,
			time_epoch,
			...rest
		}
	})

	const astroTimeline = astros.flatMap((astro) => {
		const sunrise = createAstroTimeline(astro, 'sunrise')
		const sunset = createAstroTimeline(astro, 'sunset')

		return [sunrise, sunset].filter((astro) => astro !== null)
	})

	const timeline = [...hourTimeline, ...astroTimeline]
		.filter((item) => item.epoch > baseHourEpoch)
		.sort((a, b) => a.epoch - b.epoch)

	return { timeline, baseDate }
}

export { createHourlyWeatherTimeline, getHourlyTimelineItemKey }
export type { HourlyWeatherTimeline }
