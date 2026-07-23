/** 숫자·단위·URL 등 화면 표시용 변환 유틸. 서버·클라이언트 공용입니다. */

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

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

/** `05:32 AM` → `05:32`. 파싱 실패 시 `-`를 반환합니다. */
function formatTime12To24(time: string): string {
	const parsed = dayjs(time, 'hh:mm A')

	if (!parsed.isValid()) {
		return '-'
	}

	return parsed.format('HH:mm')
}

export { DEFAULT_DISPLAY_LOCALE, formatDate, formatLocaleNumber, formatTime12To24 }
