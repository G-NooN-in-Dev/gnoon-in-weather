/** 온도 단위 */
type TemperatureUnit = 'c' | 'f'

/** 거리·풍속 단위 */
type DistanceUnit = 'km' | 'miles'

/** 강수량 단위 */
type PrecipitationUnit = 'mm' | 'inch'

/** 화면 전역에서 공유하는 날씨 단위 설정 */
type WeatherUnits = {
	temperature: TemperatureUnit
	distance: DistanceUnit
	precipitation: PrecipitationUnit
}

export type { DistanceUnit, PrecipitationUnit, TemperatureUnit, WeatherUnits }
