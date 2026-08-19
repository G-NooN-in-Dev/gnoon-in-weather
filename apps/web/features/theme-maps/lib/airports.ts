type AirportKind = 'international' | 'domestic'

/** 공항 지도 필터. 국제선 공항은 국내선도 운항하므로 국내선 전용 탭은 두지 않습니다. */
type AirportMapFilter = 'all' | 'international'

type Airport = {
	iata: string
	name: string
	address: string
	lat: number
	lng: number
	kind: AirportKind
}

const AIRPORTS = [
	{
		iata: 'ICN',
		name: '인천국제공항',
		address: '인천 중구 공항로 272',
		lat: 37.4602,
		lng: 126.4407,
		kind: 'international'
	},
	{
		iata: 'GMP',
		name: '김포국제공항',
		address: '서울 강서구 하늘길 38',
		lat: 37.558056,
		lng: 126.790556,
		kind: 'international'
	},
	{
		iata: 'PUS',
		name: '김해국제공항',
		address: '부산 강서구 공항진입로 108',
		lat: 35.179444,
		lng: 128.938056,
		kind: 'international'
	},
	{
		iata: 'CJU',
		name: '제주국제공항',
		address: '제주 제주시 공항로 2',
		lat: 33.511111,
		lng: 126.492778,
		kind: 'international'
	},
	{
		iata: 'TAE',
		name: '대구국제공항',
		address: '대구 동구 공항로 221',
		lat: 35.9,
		lng: 128.638,
		kind: 'international'
	},
	{
		iata: 'CJJ',
		name: '청주국제공항',
		address: '충북 청주시 내수읍 오창대로 980 5-4',
		lat: 36.7221,
		lng: 127.4958,
		kind: 'international'
	},
	{
		iata: 'MWX',
		name: '무안국제공항',
		address: '전남광주 무안군 망운면 공항로 970-260',
		lat: 34.991406,
		lng: 126.382814,
		kind: 'international'
	},
	{
		iata: 'YNY',
		name: '양양국제공항',
		address: '강원 양양군 손양면 공항로 201',
		lat: 38.061111,
		lng: 128.668889,
		kind: 'international'
	},
	{
		iata: 'KWJ',
		name: '광주공항',
		address: '전남광주 광산구 상무대로 420-25',
		lat: 35.1397,
		lng: 126.8106,
		kind: 'domestic'
	},
	{
		iata: 'USN',
		name: '울산공항',
		address: '울산 북구 산업로 1103',
		lat: 35.593333,
		lng: 129.351667,
		kind: 'domestic'
	},
	{
		iata: 'RSU',
		name: '여수공항',
		address: '전남광주 여수시 율촌면 여순로 386',
		lat: 34.842222,
		lng: 127.616667,
		kind: 'domestic'
	},
	{
		iata: 'KPO',
		name: '포항경주공항',
		address: '경북 포항시 남구 동해면 일월로 18',
		lat: 35.9865,
		lng: 129.4335,
		kind: 'domestic'
	},
	{
		iata: 'HIN',
		name: '사천공항',
		address: '경남 사천시 사천읍 사천대로 1971',
		lat: 35.092,
		lng: 128.0867,
		kind: 'domestic'
	},
	{
		iata: 'KUV',
		name: '군산공항',
		address: '전북 군산시 옥서면 산동길 2',
		lat: 35.926,
		lng: 126.6158,
		kind: 'domestic'
	},
	{
		iata: 'WJU',
		name: '원주공항',
		address: '강원 횡성군 횡성읍 횡성로 42',
		lat: 37.4591,
		lng: 127.977,
		kind: 'domestic'
	}
] as const satisfies readonly Airport[]

type AirportIata = (typeof AIRPORTS)[number]['iata']

const AIRPORTS_BY_IATA = new Map<string, Airport>(AIRPORTS.map((airport) => [airport.iata, airport]))

function getAirportByIata(iata: string): Airport | undefined {
	return AIRPORTS_BY_IATA.get(iata.toUpperCase())
}

const AIRPORT_MAP_FILTER_OPTIONS = [
	{ value: 'all', label: '전체' },
	{ value: 'international', label: '국제선' }
] as const satisfies ReadonlyArray<{ value: AirportMapFilter; label: string }>

/** 스위치가 켜지면 국제공항만, 꺼지면 전체 공항 마커를 보여 줍니다. */
function setOnlyInternationalMode(kind: AirportKind, internationalOnly: boolean): boolean {
	return !internationalOnly || kind === 'international'
}

function isAirportVisibleForFilter(airport: Airport, filter: AirportMapFilter): boolean {
	return setOnlyInternationalMode(airport.kind, filter === 'international')
}

export { AIRPORT_MAP_FILTER_OPTIONS, AIRPORTS, getAirportByIata, isAirportVisibleForFilter, setOnlyInternationalMode }
export type { Airport, AirportIata, AirportKind, AirportMapFilter }
