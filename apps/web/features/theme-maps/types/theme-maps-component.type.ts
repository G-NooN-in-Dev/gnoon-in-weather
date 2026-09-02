import type { WeatherUnits } from '@/types/weather-units.type'

/** 공항 지도 섹션 */
type AirportsMapSectionProps = {
	selectedIata: string | null
	onSelect: (iata: string) => void
	onClear: () => void
}

/** 야구장 지도 섹션 */
type BaseballMapSectionProps = {
	selectedParkId: string | null
	onSelect: (id: string) => void
	onClear: () => void
}

/** 공항 지도 client 조합기 초기 props */
type AirportsClientProps = {
	initialUnits: WeatherUnits | null
}

/** 야구장 지도 client 조합기 초기 props */
type BaseballClientProps = {
	initialUnits: WeatherUnits | null
}

/** 공항 상세 page props */
type ThemeMapsAirportDetailPageProps = {
	params: Promise<{ iata: string }>
}

/** 야구장 상세 page props */
type ThemeMapsBaseballDetailPageProps = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ level?: string | string[] }>
}

export type {
	AirportsClientProps,
	AirportsMapSectionProps,
	BaseballClientProps,
	BaseballMapSectionProps,
	ThemeMapsAirportDetailPageProps,
	ThemeMapsBaseballDetailPageProps
}
