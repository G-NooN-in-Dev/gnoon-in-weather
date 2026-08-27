import { NAVER_NEWS_START_MAX } from '@/lib/naver/constants'
import type { WeatherNewsListItem } from '@/types/naver-news.type'

/** 커서 파싱 결과 — 네이버 API start와 이전 페이지에서 남긴 버퍼 */
type ParsedNewsCursor = {
	start: number
	buffer: WeatherNewsListItem[]
}

type EncodedNewsCursorPayload = {
	start: number
	buffer?: WeatherNewsListItem[]
}

/** start(1~1000)만 담은 단순 커서인지 판별합니다. */
function isValidNewsCursorStart(start: number): boolean {
	return Number.isInteger(start) && start >= 1 && start <= NAVER_NEWS_START_MAX
}

/** 날씨 뉴스에 해당하는 아이템인지 판별합니다. */
function isWeatherNewsListItem(value: unknown): value is WeatherNewsListItem {
	if (!value || typeof value !== 'object') {
		return false
	}

	const item = value as Partial<WeatherNewsListItem>

	return (
		typeof item.id === 'string' &&
		typeof item.title === 'string' &&
		typeof item.description === 'string' &&
		typeof item.pubDate === 'string' &&
		typeof item.link === 'string' &&
		typeof item.originallink === 'string' &&
		typeof item.pressName === 'string'
	)
}

function parseEncodedNewsCursor(cursor: string): ParsedNewsCursor | null {
	try {
		const payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as EncodedNewsCursorPayload

		if (!isValidNewsCursorStart(payload.start)) {
			return null
		}

		const buffer = Array.isArray(payload.buffer) ? payload.buffer.filter(isWeatherNewsListItem) : []

		return { start: payload.start, buffer }
	} catch {
		return null
	}
}

/** 커서 문자열이 유효한지 판별합니다. (숫자 start 또는 base64 JSON) */
function isValidNewsCursor(cursor: string): boolean {
	const numericStart = Number(cursor)

	if (Number.isInteger(numericStart) && isValidNewsCursorStart(numericStart)) {
		return true
	}

	return parseEncodedNewsCursor(cursor) !== null
}

/** 쿼리 cursor를 start·버퍼로 파싱합니다. 없거나 잘못되면 첫 페이지로 처리합니다. */
function parseNewsCursor(cursor: string | null | undefined): ParsedNewsCursor {
	if (!cursor) {
		return { start: 1, buffer: [] }
	}

	const numericStart = Number(cursor)

	if (Number.isInteger(numericStart) && isValidNewsCursorStart(numericStart)) {
		return { start: numericStart, buffer: [] }
	}

	const encoded = parseEncodedNewsCursor(cursor)

	if (encoded) {
		return encoded
	}

	return { start: 1, buffer: [] }
}

/**
 * 다음 페이지 커서를 만듭니다.
 * 필터 후 남은 항목(버퍼)이 있으면 base64 JSON으로, 없으면 start 숫자 문자열을 씁니다.
 */
function createNewsNextCursor(nextStart: number, buffer: WeatherNewsListItem[], total: number): string | null {
	const canFetchMore = nextStart <= total && nextStart <= NAVER_NEWS_START_MAX

	if (buffer.length === 0 && !canFetchMore) {
		return null
	}

	if (buffer.length === 0) {
		return String(nextStart)
	}

	const payload: EncodedNewsCursorPayload = { start: nextStart, buffer }

	return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

export { createNewsNextCursor, isValidNewsCursor, isValidNewsCursorStart, parseNewsCursor }
export type { ParsedNewsCursor }
