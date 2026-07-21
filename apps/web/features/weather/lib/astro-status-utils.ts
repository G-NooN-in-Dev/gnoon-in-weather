import dayjs, { type Dayjs } from 'dayjs'

import { formatAstroScheduleTime } from '@/features/weather/lib/format-weather-values'

/** API 천체 시각(`06:32 AM`)을 해당 날짜의 Dayjs로 변환합니다. */
function parseAstroDateTime(date: string, time: string): Dayjs | null {
	const time24 = formatAstroScheduleTime(time)

	if (time24 === '-') {
		return null
	}

	return dayjs(`${date} ${time24}`)
}

/** from → to 까지 남은 시·분을 계산합니다. 음수는 0으로 보정합니다. */
function calculateAstroDiffTime(from: Dayjs, to: Dayjs) {
	const totalMinutes = Math.max(0, to.diff(from, 'minute'))

	return {
		hours: Math.floor(totalMinutes / 60),
		minutes: totalMinutes % 60
	}
}

/** UI progress 비율이 안전하게 0~1 범위를 유지하도록 보정합니다. */
function clampProgress(progress: number) {
	return Math.min(1, Math.max(0, progress))
}

export { calculateAstroDiffTime, clampProgress, parseAstroDateTime }
