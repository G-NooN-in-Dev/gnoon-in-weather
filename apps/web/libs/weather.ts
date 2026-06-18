/** WeatherAPI realtime(current) 데이터 갱신 주기 — 5분 */
const REALTIME_REVALIDATE_SECONDS = 300

/** WeatherAPI forecast 데이터 갱신 주기 — 30분 */
const FORECAST_REVALIDATE_SECONDS = 1800

const WIND_DIRECTIONS = {
	N: '북',
	NNE: '북북동',
	NE: '동북',
	ENE: '동동북',
	E: '동',
	ESE: '동동남',
	SE: '남동',
	SSE: '남남동',
	S: '남',
	SSW: '남남서',
	SW: '남서',
	WSW: '서남서',
	W: '서',
	WNW: '서서북',
	NW: '북서',
	NNW: '북북서'
}

export { FORECAST_REVALIDATE_SECONDS, REALTIME_REVALIDATE_SECONDS, WIND_DIRECTIONS }
