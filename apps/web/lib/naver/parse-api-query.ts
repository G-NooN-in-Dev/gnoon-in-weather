import { isValidNewsCursor } from '@/lib/naver/cursor'
import type { AppApiError } from '@/types/error.type'

/** `/api/naver/news` 커서 형식 오류 */
const NAVER_INVALID_CURSOR_ERROR: AppApiError = {
	provider: 'naver',
	code: 0,
	key: 'NAVER_INVALID_CURSOR',
	status: 400,
	retryable: false,
	message: '뉴스 페이지 커서가 유효하지 않습니다.'
}

type ParseNaverNewsCursorResult = { ok: true; cursor: string | null } | { ok: false }

/**
 * `/api/naver/news`의 cursor 파라미터를 파싱합니다.
 * 없으면 첫 페이지(cursor null), 형식이 잘못되면 ok: false.
 */
function parseNaverNewsCursorQuery(searchParams: URLSearchParams): ParseNaverNewsCursorResult {
	const raw = searchParams.get('cursor')

	if (raw === null || raw === '') {
		return { ok: true, cursor: null }
	}

	if (!isValidNewsCursor(raw)) {
		return { ok: false }
	}

	return { ok: true, cursor: raw }
}

export { NAVER_INVALID_CURSOR_ERROR, parseNaverNewsCursorQuery }
export type { ParseNaverNewsCursorResult }
