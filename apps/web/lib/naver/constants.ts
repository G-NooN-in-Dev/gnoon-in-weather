/** 날씨 뉴스 기본 검색어 */
const NAVER_WEATHER_NEWS_QUERY = '날씨'

/** 화면에 한 번에 보여줄 필터링된 뉴스 개수 */
const WEATHER_NEWS_PAGE_SIZE = 20

/** 네이버 API 1회 요청당 가져올 원본 뉴스 개수 (1~100) */
const NAVER_NEWS_FETCH_BATCH = 100

/** 정렬 기준 */
const NAVER_NEWS_SORT = 'date' as const

/** 네이버 검색 start 파라미터 최댓값 */
const NAVER_NEWS_START_MAX = 1000

export {
	NAVER_NEWS_FETCH_BATCH,
	NAVER_NEWS_SORT,
	NAVER_NEWS_START_MAX,
	NAVER_WEATHER_NEWS_QUERY,
	WEATHER_NEWS_PAGE_SIZE
}
