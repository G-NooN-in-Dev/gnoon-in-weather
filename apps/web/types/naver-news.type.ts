/**
 * 네이버 검색 API — 뉴스 검색 응답·화면용 타입.
 * @see https://developers.naver.com/docs/serviceapi/search/news/news.md
 */

/** 개별 뉴스 검색 결과 (네이버 원본) */
type NaverNewsItem = {
	/** 제목. 검색어 일치 구간은 `<b>`로 감싸짐 */
	title: string
	/** 원문 URL */
	originallink: string
	/** 네이버 뉴스 URL (미제공 기사는 원문 URL) */
	link: string
	/** 요약. 검색어 일치 구간은 `<b>`로 감싸짐 */
	description: string
	/** 네이버 제공 시각 (RFC 822) */
	pubDate: string
}

/** 뉴스 검색 JSON 응답 */
type NaverNewsSearchResponse = {
	lastBuildDate: string
	total: number
	start: number
	display: number
	items: NaverNewsItem[]
}

/** 뉴스 검색 요청 파라미터 */
type NaverNewsSearchParams = {
	/** 검색어 (UTF-8) */
	query: string
	/** 한 번에 가져올 개수 (1~100, 기본 10) */
	display?: number
	/** 시작 위치 (1~1000, 기본 1) */
	start?: number
	/** `sim`: 정확도순, `date`: 날짜순 */
	sort?: 'sim' | 'date'
}

/** 화면 리스트용으로 정규화한 뉴스 아이템 */
type WeatherNewsListItem = {
	id: string
	title: string
	description: string
	/** originallink 호스트 기반 언론사 표시명 */
	pressName: string
	pubDate: string
	link: string
	originallink: string
}

/**
 * 뉴스 피드 한 묶음(더 보기용).
 * `nextCursor`는 다음 네이버 API start(숫자 문자열) 또는 남은 항목 버퍼가 포함된 base64 JSON이며, 더 없으면 null입니다.
 */
type WeatherNewsFeedPage = {
	items: WeatherNewsListItem[]
	nextCursor: string | null
}

export type { NaverNewsItem, NaverNewsSearchParams, NaverNewsSearchResponse, WeatherNewsFeedPage, WeatherNewsListItem }
