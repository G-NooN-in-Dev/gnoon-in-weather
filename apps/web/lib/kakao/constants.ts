/** 검색어 최소 길이 — 이보다 짧으면 API를 호출하지 않습니다. */
const KAKAO_SEARCH_MIN_QUERY_LENGTH = 2

/** 키워드·주소 검색 한 페이지 문서 수 */
const KAKAO_SEARCH_SIZE = 10

/** 검색 입력 debounce (ms) */
const KAKAO_SEARCH_DEBOUNCE_MS = 300

export { KAKAO_SEARCH_DEBOUNCE_MS, KAKAO_SEARCH_MIN_QUERY_LENGTH, KAKAO_SEARCH_SIZE }
