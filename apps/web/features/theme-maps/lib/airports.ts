type AirportKind = 'international' | 'domestic'

type Airport = {
	iata: string
	name: string
	lat: number
	lng: number
	kind: AirportKind
}

const AIRPORTS = [
	{ iata: 'ICN', name: '인천국제공항', lat: 37.4602, lng: 126.4407, kind: 'international' },
	{ iata: 'GMP', name: '김포국제공항', lat: 37.5583, lng: 126.7906, kind: 'international' },
	{ iata: 'PUS', name: '김해국제공항', lat: 35.1795, lng: 128.9382, kind: 'international' },
	{ iata: 'CJU', name: '제주국제공항', lat: 33.5113, lng: 126.4928, kind: 'international' },
	{ iata: 'TAE', name: '대구국제공항', lat: 35.8941, lng: 128.6589, kind: 'international' },
	{ iata: 'CJJ', name: '청주국제공항', lat: 36.7166, lng: 127.4991, kind: 'international' },
	{ iata: 'MWX', name: '무안국제공항', lat: 34.9914, lng: 126.3828, kind: 'international' },
	{ iata: 'YNY', name: '양양국제공항', lat: 38.0613, lng: 128.6692, kind: 'international' },
	{ iata: 'KWJ', name: '광주공항', lat: 35.1264, lng: 126.8089, kind: 'domestic' },
	{ iata: 'USN', name: '울산공항', lat: 35.5935, lng: 129.352, kind: 'domestic' },
	{ iata: 'RSU', name: '여수공항', lat: 34.8423, lng: 127.6169, kind: 'domestic' },
	{ iata: 'KPO', name: '포항경주공항', lat: 35.9879, lng: 129.4205, kind: 'domestic' },
	{ iata: 'HIN', name: '사천공항', lat: 35.0886, lng: 128.0704, kind: 'domestic' },
	{ iata: 'KUV', name: '군산공항', lat: 35.9038, lng: 126.6159, kind: 'domestic' },
	{ iata: 'WJU', name: '원주공항', lat: 37.4412, lng: 127.9639, kind: 'domestic' }
] as const satisfies readonly Airport[]

type AirportIata = (typeof AIRPORTS)[number]['iata']

const AIRPORTS_BY_IATA = new Map<string, Airport>(AIRPORTS.map((airport) => [airport.iata, airport]))

function getAirportByIata(iata: string): Airport | undefined {
	return AIRPORTS_BY_IATA.get(iata.toUpperCase())
}

/** 스위치가 켜지면 국제공항만, 꺼지면 전체 공항 마커를 보여 줍니다. */
function setOnlyInternationalMode(kind: AirportKind, internationalOnly: boolean): boolean {
	return !internationalOnly || kind === 'international'
}

export { AIRPORTS, getAirportByIata, setOnlyInternationalMode }
export type { Airport, AirportIata, AirportKind }
