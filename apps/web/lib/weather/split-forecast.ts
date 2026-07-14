import type { SplitForecastDaysResult, WeatherApiForecastDay, WeatherApiForecastInput } from '@/types/weather-api.type'

/**
 * forecastday 배열을 day / astro / hour 단위로 분리합니다.
 *
 * - `days`, `astros`: date, date_epoch와 해당 필드를 같은 depth로 반환
 * - `hours`: time, time_epoch가 이미 있으므로 date 없이 1차원 배열로 펼침
 */
function splitForecastDays(forecastData: WeatherApiForecastDay[]): SplitForecastDaysResult {
	return {
		days: forecastData.map(({ date, date_epoch, day }) => ({ date, date_epoch, ...day })),
		astros: forecastData.map(({ date, date_epoch, astro }) => ({ date, date_epoch, ...astro })),
		hours: forecastData.flatMap(({ hour }) => hour)
	}
}

/**
 * 예보 API 응답에서 forecastday를 꺼내 분리합니다.
 */
function splitForecast(forecastData: WeatherApiForecastInput): SplitForecastDaysResult {
	return splitForecastDays(forecastData.forecast.forecastday)
}

export { splitForecast, splitForecastDays }
