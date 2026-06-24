/** WeatherAPI realtime(current) 데이터 갱신 주기 — 5분 */
const REALTIME_REVALIDATE_SECONDS = 300

/** WeatherAPI forecast 데이터 갱신 주기 — 30분 */
const FORECAST_REVALIDATE_SECONDS = 1800

/** 8방위 풍향 라벨 (0°=북, 시계 방향 45° 간격) */
const WIND_DIRECTIONS = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'] as const

export { FORECAST_REVALIDATE_SECONDS, REALTIME_REVALIDATE_SECONDS, WIND_DIRECTIONS }
