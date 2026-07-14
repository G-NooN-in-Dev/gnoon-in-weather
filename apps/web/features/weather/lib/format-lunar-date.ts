import dayjs from 'dayjs'
import KoreanLunarCalendar from 'korean-lunar-calendar'

import { formatDate } from '@/utils/format'

/** 양력 날짜를 한국 음력(KASI 기준)으로 변환한 결과 */
type LunarDate = {
	year: number
	month: number
	day: number
	/** 윤달이면 true (`intercalation`) */
	isLeapMonth: boolean
}

/**
 * 양력 `YYYY-MM-DD` → 한국 음력 월/일.
 * 변환 실패(잘못된 날짜·지원 범위 밖) 시 `null`을 반환합니다.
 */
function createLunarDate(solarDate: string): LunarDate | null {
	const parsed = dayjs(solarDate)

	if (!parsed.isValid()) {
		return null
	}

	const calendar = new KoreanLunarCalendar()
	const ok = calendar.setSolarDate(parsed.year(), parsed.month() + 1, parsed.date())

	if (!ok) {
		return null
	}

	const { year, month, day, intercalation = false } = calendar.getLunarCalendar()

	return { year, month, day, isLeapMonth: intercalation }
}

/**
 * 천체 일정 테이블 양력 날짜 아래 줄에 넣을 음력 문구.
 * 예: `(음 06.01)` / `(음 06.01 (윤))`
 */
function formatLunarDateExtra(solarDate: string): string | null {
	const lunar = createLunarDate(solarDate)

	if (!lunar) {
		return null
	}

	const { year, month, day, isLeapMonth } = lunar

	const formattedLunarDate = formatDate(`${year}-${month}-${day}`, 'MM.DD')
	const leapLabel = isLeapMonth ? ' (윤)' : ''

	return `(음 ${formattedLunarDate}${leapLabel})`
}

export { createLunarDate, formatLunarDateExtra }
export type { LunarDate }
