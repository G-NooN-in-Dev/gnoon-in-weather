/** 숫자·단위·URL 등 화면 표시용 변환 유틸. 서버·클라이언트 공용입니다. */

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { WIND_DIRECTIONS } from '@/libs/weather'

dayjs.extend(customParseFormat)

/** 숫자 천 단위 구분 등에 쓰는 기본 로케일 */
const DEFAULT_DISPLAY_LOCALE = 'ko-KR'

type FormatLocaleNumberOptions = Intl.NumberFormatOptions & {
	/** 미지정 시 `ko-KR` */
	locale?: string
}

/** 숫자를 로케일 형식 문자열로 변환합니다. */
function formatLocaleNumber(value: number, options?: FormatLocaleNumberOptions): string {
	const { locale = DEFAULT_DISPLAY_LOCALE, ...numberFormatOptions } = options ?? {}

	return value.toLocaleString(locale, numberFormatOptions)
}

/** 날짜를 포맷팅합니다. */
function formatDate(date: string, format?: string, includeTime?: boolean): string {
	const baseDate = dayjs(date)

	if (format) {
		return baseDate.format(format)
	} else {
		return includeTime ? baseDate.format('YYYY-MM-DD HH:mm:ss') : baseDate.format('YYYY-MM-DD')
	}
}

function formatTime12To24(time: string): string {
	return dayjs(time, 'hh:mm A').format('HH:mm')
}

/**
 * WeatherAPI `condition.icon`을 Next Image `src`에 쓸 수 있는 절대 URL로 변환합니다.
 * API는 `//cdn.weatherapi.com/...` 형태의 프로토콜 상대 URL을 반환합니다.
 */
function formatWeatherIconUrl(icon: string): string {
	if (icon.startsWith('http')) {
		return icon
	}

	return `https:${icon}`
}

/** 3일 예보·천체 일정 등에서 쓰는 일차 라벨 */
const DAY_LABELS = ['오늘', '내일', '모레'] as const

/** 예보 일차 인덱스를 화면 라벨(오늘/내일/모레)로 변환합니다. */
function getDayLabel(dayIndex: number): string {
	return DAY_LABELS[dayIndex] ?? `${dayIndex + 1}일차`
}

/** 풍속(km/h)을 화면 표시용 m/s로 변환합니다. 소수 첫째 자리까지 반올림합니다. */
function formatWindKphToMps(kph: number): number {
	return Math.floor((kph / 3.6) * 10) / 10
}

/** 풍향을 화면 표시용 문자열로 변환합니다. */
function formatWindDirection(direction: string): string {
	return WIND_DIRECTIONS[direction as keyof typeof WIND_DIRECTIONS] + '풍'
}

/** UV 지수를 화면 표시용 문자열로 변환합니다. */
function formatUvIndexLabel(uv: number): string {
	if (uv >= 11) return '위험'
	else if (uv >= 8) return '매우 높음'
	else if (uv >= 6) return '높음'
	else if (uv >= 3) return '보통'
	else return '낮음'
}

export {
	DAY_LABELS,
	DEFAULT_DISPLAY_LOCALE,
	formatDate,
	formatLocaleNumber,
	formatTime12To24,
	formatUvIndexLabel,
	formatWeatherIconUrl,
	formatWindDirection,
	formatWindKphToMps,
	getDayLabel
}
