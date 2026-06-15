/** WeatherAPI 공통 날씨 상태 */
export type WeatherApiCondition = {
	text: string
	icon: string
	code: number
}

/** 일별 요약 (최고/최저 기온, 강수 확률 등) */
export type WeatherApiDay = {
	maxtemp_c: number
	maxtemp_f: number
	mintemp_c: number
	mintemp_f: number
	avgtemp_c: number
	avgtemp_f: number
	maxwind_mph: number
	maxwind_kph: number
	totalprecip_mm: number
	totalprecip_in: number
	totalsnow_cm: number
	avgvis_km: number
	avgvis_miles: number
	avghumidity: number
	daily_will_it_rain: number
	daily_chance_of_rain: number
	daily_will_it_snow: number
	daily_chance_of_snow: number
	condition: WeatherApiCondition
	uv: number
}

/** 천체 정보 (일출/일몰, 월출/월몰 등) */
export type WeatherApiAstro = {
	sunrise: string
	sunset: string
	moonrise: string
	moonset: string
	moon_phase: string
	moon_illumination: number
	is_moon_up: number
	is_sun_up: number
}

/** 시간별 날씨 */
export type WeatherApiHour = {
	time_epoch: number
	time: string
	temp_c: number
	temp_f: number
	is_day: number
	condition: WeatherApiCondition
	wind_mph: number
	wind_kph: number
	wind_degree: number
	wind_dir: string
	pressure_mb: number
	pressure_in: number
	precip_mm: number
	precip_in: number
	snow_cm: number
	humidity: number
	cloud: number
	feelslike_c: number
	feelslike_f: number
	windchill_c: number
	windchill_f: number
	heatindex_c: number
	heatindex_f: number
	dewpoint_c: number
	dewpoint_f: number
	will_it_rain: number
	chance_of_rain: number
	will_it_snow: number
	chance_of_snow: number
	vis_km: number
	vis_miles: number
	gust_mph: number
	gust_kph: number
	uv: number
}

/** forecast.forecastday 배열의 하루 단위 원본 데이터 */
export type WeatherApiForecastDay = {
	date: string
	date_epoch: number
	day: WeatherApiDay
	astro: WeatherApiAstro
	hour: WeatherApiHour[]
}

/** 예보 API 응답 중 분리 로직에 필요한 최소 형태 */
export type WeatherApiForecastInput = {
	forecast: {
		forecastday: WeatherApiForecastDay[]
	}
}

/** 분리된 항목에 공통으로 포함되는 날짜 메타 */
export type ForecastDateMeta = {
	date: string
	date_epoch: number
}

/** day 필드를 date와 같은 depth로 펼친 항목 (DailyWeatherSection 등) */
export type ForecastDayEntry = ForecastDateMeta & WeatherApiDay

/** astro 필드를 date와 같은 depth로 펼친 항목 (SunriseSunsetSection, MoonriseMoonsetSection 등) */
export type ForecastAstroEntry = ForecastDateMeta & WeatherApiAstro

/** splitForecast / splitForecastDays 반환값 */
export type SplitForecastDaysResult = {
	/** 3일치 일별 요약. `days[0].maxtemp_c`처럼 바로 접근 */
	days: ForecastDayEntry[]
	/** 3일치 천체 정보. `astros[0].sunrise`처럼 바로 접근 */
	astros: ForecastAstroEntry[]
	/** 3일치 시간별 데이터를 1차원으로 펼친 배열 (각 항목의 time, time_epoch 사용) */
	hours: WeatherApiHour[]
}
