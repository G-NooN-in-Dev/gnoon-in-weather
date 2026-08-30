/** 숫자·단위·URL 등 화면 표시용 변환 유틸. 서버·클라이언트 공용입니다. */

import 'dayjs/locale/ko'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.locale('ko')

/** 숫자 천 단위 구분 등에 쓰는 기본 로케일 */
const DEFAULT_DISPLAY_LOCALE = 'ko-KR'

type FormatLocaleNumberOptions = Intl.NumberFormatOptions & {
	/** 미지정 시 `ko-KR` */
	locale?: string
}

/** API 생략·파싱 실패까지 포함한 표시용 숫자 입력 */
type NumericInput = number | null | undefined

/**
 * 표시에 쓸 수 있는 숫자로 정규화합니다.
 * `null` / `undefined` / `NaN` / `Infinity`는 fallback(기본 `0`)으로 바꿉니다.
 */
function normalizeNumber(value: NumericInput, fallback: number = 0): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/** 숫자를 로케일 형식 문자열로 변환합니다. 비정상 값은 `normalizeNumber`로 보정합니다. */
function formatLocaleNumber(value: NumericInput, options?: FormatLocaleNumberOptions): string {
	const { locale = DEFAULT_DISPLAY_LOCALE, ...numberFormatOptions } = options ?? {}

	return normalizeNumber(value).toLocaleString(locale, numberFormatOptions)
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

/** `05:32 AM` → `05:32`. 파싱 실패 시 `-`를 반환합니다. */
function formatTime12To24(time: string): string {
	// WeatherAPI는 영문 AM/PM을 쓰므로, 전역 ko locale과 분리해 en으로만 파싱합니다.
	const parsedTime = dayjs(time, 'hh:mm A', 'en', true)

	if (!parsedTime.isValid()) {
		return '-'
	}

	return parsedTime.format('HH:mm')
}

/**
 * 시각을 상대 시간 문자열로 변환합니다. (예: `2시간 전`)
 * 파싱 실패 시 빈 문자열을 반환합니다.
 */
function formatRelativeTime(date: string): string {
	const parsedTime = dayjs(date)

	if (!parsedTime.isValid()) {
		return ''
	}

	const relativeTime = parsedTime.fromNow()

	return relativeTime === '한 시간 전' ? '1시간 전' : relativeTime
}

export { DEFAULT_DISPLAY_LOCALE, formatDate, formatLocaleNumber, formatRelativeTime, formatTime12To24, normalizeNumber }
