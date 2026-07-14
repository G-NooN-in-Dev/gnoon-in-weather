import { getWeatherConditionIconUrl } from '@/features/weather/lib/format-weather-values'

/**
 * 시간별/일별 날씨 아이콘 범례(Info Popover)용 데이터.
 * API 조건은 강도·세부 타입까지 세분되어 있어, 범례에서는 대표 아이콘·라벨만 보여줍니다.
 */

type WeatherConditionLegendGroup = {
	/** 목록 key · 접근성용 */
	id: string
	/** 사용자에게 보여줄 통합 라벨 */
	label: string
	/** 그룹을 대표하는 WeatherAPI icon 번호 */
	icon: number
}

type WeatherConditionLegendItem = {
	id: string
	label: string
	dayIconUrl: string
	nightIconUrl: string
}

/**
 * 비슷한 날씨 조건을 하나의 범례 항목으로 묶은 목록입니다.
 * (안개·연무·먼지·황사 등은 한 그룹으로 통합)
 */
const WEATHER_CONDITION_LEGEND_GROUPS = [
	{ id: 'clear', label: '맑음', icon: 113 },
	{ id: 'partly-cloudy', label: '부분적으로 흐림', icon: 116 },
	{ id: 'cloudy', label: '흐림', icon: 119 },
	{ id: 'fog-haze-dust', label: '안개·연무·먼지·황사', icon: 143 },
	{ id: 'rain-possible', label: '한때 비', icon: 176 },
	{ id: 'drizzle', label: '이슬비', icon: 266 },
	{ id: 'rain', label: '비', icon: 296 },
	{ id: 'freezing-rain', label: '어는 비', icon: 311 },
	{ id: 'sleet', label: '진눈깨비', icon: 317 },
	{ id: 'snow', label: '눈', icon: 326 },
	{ id: 'blizzard', label: '눈보라', icon: 230 },
	{ id: 'ice-pellets', label: '우박', icon: 350 },
	{ id: 'thunder', label: '뇌우', icon: 200 }
] as const satisfies ReadonlyArray<WeatherConditionLegendGroup>

/** Popover 테이블에 바로 넣을 수 있는 범례 행을 반환합니다. */
function getWeatherConditionLegendItems(): WeatherConditionLegendItem[] {
	return WEATHER_CONDITION_LEGEND_GROUPS.map(({ id, label, icon }) => ({
		id,
		label,
		dayIconUrl: getWeatherConditionIconUrl(icon, 'day'),
		nightIconUrl: getWeatherConditionIconUrl(icon, 'night')
	}))
}

export { getWeatherConditionLegendItems, WEATHER_CONDITION_LEGEND_GROUPS }
export type { WeatherConditionLegendGroup, WeatherConditionLegendItem }
