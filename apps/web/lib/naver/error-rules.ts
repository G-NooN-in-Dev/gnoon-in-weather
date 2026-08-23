import type { AppApiErrorRule } from '@/types/error.type'

/**
 * 네이버 검색 API 뉴스 검색 오류 코드 매핑.
 * @see https://developers.naver.com/docs/serviceapi/search/news/news.md
 */
const NAVER_NEWS_ERROR_RULES: Record<string, AppApiErrorRule> = {
	SE01: {
		key: 'NAVER_INCORRECT_QUERY',
		status: 400,
		retryable: false,
		message: '네이버 뉴스 검색 요청이 올바르지 않습니다.'
	},
	SE02: {
		key: 'NAVER_INVALID_DISPLAY',
		status: 400,
		retryable: false,
		message: '네이버 뉴스 검색 display 값이 허용 범위를 벗어났습니다.'
	},
	SE03: {
		key: 'NAVER_INVALID_START',
		status: 400,
		retryable: false,
		message: '네이버 뉴스 검색 start 값이 허용 범위를 벗어났습니다.'
	},
	SE04: {
		key: 'NAVER_INVALID_SORT',
		status: 400,
		retryable: false,
		message: '네이버 뉴스 검색 sort 값이 올바르지 않습니다.'
	},
	SE05: {
		key: 'NAVER_INVALID_SEARCH_API',
		status: 404,
		retryable: false,
		message: '요청한 네이버 검색 API가 존재하지 않습니다.'
	},
	SE06: {
		key: 'NAVER_MALFORMED_ENCODING',
		status: 400,
		retryable: false,
		message: '네이버 뉴스 검색어 인코딩이 올바르지 않습니다.'
	},
	SE99: {
		key: 'NAVER_SYSTEM_ERROR',
		status: 500,
		retryable: true,
		message: '네이버 검색 API 시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
	}
}

export { NAVER_NEWS_ERROR_RULES }
