/**
 * WeatherAPI Weather Maps(타일) 공통 상수·좌표 계산.
 * 화면·타일 크롭은 대한민국 전역(본토·제주·울릉·독도) 고정 뷰를 기준으로 합니다.
 */

/** WeatherAPI 타일 레이어 */
const WEATHER_MAP_LAYERS = ['tmp2m', 'precip', 'pressure'] as const

type WeatherMapLayer = (typeof WEATHER_MAP_LAYERS)[number]

const WEATHER_MAP_LAYER_LABEL = {
	tmp2m: '기온',
	precip: '강수',
	pressure: '기압'
} as const satisfies Record<WeatherMapLayer, string>

/** WeatherAPI 타일 서버 (키 불필요) */
const WEATHER_MAP_TILE_BASE_URL = 'https://weathermaps.weatherapi.com'

/** WeatherAPI 타일 최대 줌 (공식 데모 기준) */
const WEATHER_MAP_ZOOM = 6

/** 타일 한 장 픽셀 크기 */
const WEATHER_MAP_TILE_SIZE = 256

/**
 * 대한민국 전역 뷰 (본토·제주도·울릉도·독도).
 * preview/detail 지도·타일 크롭에 공통으로 씁니다.
 */
const KOREA_VIEW_BOUNDS = {
	south: 33.0,
	west: 124.5,
	north: 38.7,
	east: 132.0
} as const

/**
 * Dialog setBounds 패딩을 0으로 두어 전역 뷰가 화면에 더 크게 보이게 합니다.
 * 미리보기는 카카오 기본 패딩(32)을 그대로 씁니다.
 */
const KOREA_DETAIL_MAP_BOUNDS_PADDING = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
} as const

/** 날씨 맵 화면 종류: 카드 미리보기 / Dialog 상세 (뷰 bounds는 동일, 패딩만 다름) */
const WEATHER_MAP_VIEW_VARIANTS = ['preview', 'detail'] as const

type WeatherMapViewVariant = (typeof WEATHER_MAP_VIEW_VARIANTS)[number]

type LatLngBoundsLiteral = {
	south: number
	west: number
	north: number
	east: number
}

type WeatherMapTileCoord = {
	x: number
	y: number
	z: number
}

type WeatherMapMosaic = {
	zoom: number
	minX: number
	maxX: number
	minY: number
	maxY: number
	cols: number
	rows: number
	/** 모자이크 SW (남서) — 타일 모서리 */
	sw: { lat: number; lng: number }
	/** 모자이크 NE (북동) — 타일 모서리 */
	ne: { lat: number; lng: number }
	tiles: WeatherMapTileCoord[]
	/** 뷰 bounds를 모자이크 픽셀로 자른 영역 */
	viewCrop: {
		x: number
		y: number
		width: number
		height: number
	}
}

/** Weather Maps 한 시각 슬롯 (UTC 날짜·시) */
type WeatherMapTimeSlot = {
	/** yyyyMMdd (UTC) */
	dateKey: string
	/** HH zero-padded (UTC) */
	hourKey: string
	/** 슬라이더용 epoch(ms) — 해당 UTC 시각 */
	epochMs: number
}

function isWeatherMapLayer(value: string): value is WeatherMapLayer {
	return (WEATHER_MAP_LAYERS as readonly string[]).includes(value)
}

/** Web Mercator 위·경도 → XYZ 타일 인덱스 */
function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
	const n = 2 ** zoom
	const x = Math.floor(((lng + 180) / 360) * n)
	const latRad = (lat * Math.PI) / 180
	const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n)

	return { x, y }
}

/** Web Mercator 위·경도 → 월드 픽셀 좌표 */
function latLngToWorldPixel(lat: number, lng: number, zoom: number, tileSize: number = WEATHER_MAP_TILE_SIZE) {
	const scale = tileSize * 2 ** zoom
	const x = ((lng + 180) / 360) * scale
	const latRad = (lat * Math.PI) / 180
	const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale

	return { x, y }
}

/** 타일 좌상단(NW) 모서리 위·경도 */
function tileNwToLatLng(x: number, y: number, zoom: number): { lat: number; lng: number } {
	const n = 2 ** zoom
	const lng = (x / n) * 360 - 180
	const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)))
	const lat = (latRad * 180) / Math.PI

	return { lat, lng }
}

/**
 * 뷰 bounds를 덮는 WeatherAPI 타일 모자이크 + 뷰 크롭 메타.
 * 고정 뷰이므로 한 번 계산해 재사용합니다.
 */
function createKoreaWeatherMapMosaic(
	viewBounds: LatLngBoundsLiteral = KOREA_VIEW_BOUNDS,
	zoom: number = WEATHER_MAP_ZOOM
): WeatherMapMosaic {
	const swTile = latLngToTile(viewBounds.south, viewBounds.west, zoom)
	const neTile = latLngToTile(viewBounds.north, viewBounds.east, zoom)

	const minX = Math.min(swTile.x, neTile.x)
	const maxX = Math.max(swTile.x, neTile.x)
	const minY = Math.min(swTile.y, neTile.y)
	const maxY = Math.max(swTile.y, neTile.y)

	const tiles: WeatherMapTileCoord[] = []
	for (let y = minY; y <= maxY; y += 1) {
		for (let x = minX; x <= maxX; x += 1) {
			tiles.push({ x, y, z: zoom })
		}
	}

	const mosaicNwWorld = {
		x: minX * WEATHER_MAP_TILE_SIZE,
		y: minY * WEATHER_MAP_TILE_SIZE
	}
	const viewNw = latLngToWorldPixel(viewBounds.north, viewBounds.west, zoom)
	const viewSe = latLngToWorldPixel(viewBounds.south, viewBounds.east, zoom)

	return {
		zoom,
		minX,
		maxX,
		minY,
		maxY,
		cols: maxX - minX + 1,
		rows: maxY - minY + 1,
		sw: tileNwToLatLng(minX, maxY + 1, zoom),
		ne: tileNwToLatLng(maxX + 1, minY, zoom),
		tiles,
		viewCrop: {
			x: viewNw.x - mosaicNwWorld.x,
			y: viewNw.y - mosaicNwWorld.y,
			width: viewSe.x - viewNw.x,
			height: viewSe.y - viewNw.y
		}
	}
}

/** 대한민국 전역 고정 뷰에 맞춘 타일 모자이크 (preview/detail 공용) */
const KOREA_WEATHER_MAP_MOSAIC = createKoreaWeatherMapMosaic(KOREA_VIEW_BOUNDS)

/** 타일 프록시 허용 범위 — 전역 모자이크와 동일 */
const KOREA_WEATHER_MAP_TILE_ALLOWANCE = {
	zoom: WEATHER_MAP_ZOOM,
	minX: KOREA_WEATHER_MAP_MOSAIC.minX,
	maxX: KOREA_WEATHER_MAP_MOSAIC.maxX,
	minY: KOREA_WEATHER_MAP_MOSAIC.minY,
	maxY: KOREA_WEATHER_MAP_MOSAIC.maxY
} as const

/** variant는 프레임 캐시 키 구분용 — 모자이크 자체는 전역 뷰 하나 */
function getKoreaWeatherMapMosaic(_variant: WeatherMapViewVariant): WeatherMapMosaic {
	return KOREA_WEATHER_MAP_MOSAIC
}

/** variant와 무관하게 대한민국 전역 bounds를 반환합니다. */
function getKoreaViewBounds(_variant: WeatherMapViewVariant): LatLngBoundsLiteral {
	return KOREA_VIEW_BOUNDS
}

function isWeatherMapViewVariant(value: string): value is WeatherMapViewVariant {
	return (WEATHER_MAP_VIEW_VARIANTS as readonly string[]).includes(value)
}

/** WeatherAPI 원본 타일 URL */
function buildWeatherMapTileUrl(layer: WeatherMapLayer, dateKey: string, hourKey: string, tile: WeatherMapTileCoord) {
	const { z, x, y } = tile
	return `${WEATHER_MAP_TILE_BASE_URL}/${layer}/tiles/${dateKey}${hourKey}/${z}/${x}/${y}.png`
}

/** 프레임 캐시 키 (preview/detail 화면 인스턴스 구분용 — 크롭은 동일) */
function buildWeatherMapFrameKey(
	layer: WeatherMapLayer,
	dateKey: string,
	hourKey: string,
	variant: WeatherMapViewVariant = 'preview'
) {
	return `${variant}:${layer}:${dateKey}${hourKey}`
}

/** UTC 기준 yyyyMMdd / HH */
function formatUtcDateHourKeys(date: Date): Pick<WeatherMapTimeSlot, 'dateKey' | 'hourKey'> {
	const year = date.getUTCFullYear()
	const month = String(date.getUTCMonth() + 1).padStart(2, '0')
	const day = String(date.getUTCDate()).padStart(2, '0')
	const hour = String(date.getUTCHours()).padStart(2, '0')

	return {
		dateKey: `${year}${month}${day}`,
		hourKey: hour
	}
}

/**
 * 현재 UTC 시각(정시)부터 hourCount시간 앞까지 1시간 슬롯을 만듭니다.
 * WeatherAPI 문서: 향후 약 3일·1시간 간격.
 */
function createWeatherMapTimeSlots(hourCount: number = 72, now: Date = new Date()): WeatherMapTimeSlot[] {
	const start = new Date(now)
	start.setUTCMinutes(0, 0, 0)

	const slots: WeatherMapTimeSlot[] = []
	for (let i = 0; i < hourCount; i += 1) {
		const at = new Date(start.getTime() + i * 60 * 60 * 1000)
		const { dateKey, hourKey } = formatUtcDateHourKeys(at)
		slots.push({ dateKey, hourKey, epochMs: at.getTime() })
	}

	return slots
}

/** 화면 표시용 (KST) 시각 라벨 */
function formatWeatherMapSlotLabel(epochMs: number, timeZone: string = 'Asia/Seoul') {
	return new Intl.DateTimeFormat('ko-KR', {
		timeZone,
		month: 'numeric',
		day: 'numeric',
		weekday: 'short',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(new Date(epochMs))
}

export {
	buildWeatherMapFrameKey,
	buildWeatherMapTileUrl,
	createKoreaWeatherMapMosaic,
	createWeatherMapTimeSlots,
	formatUtcDateHourKeys,
	formatWeatherMapSlotLabel,
	getKoreaViewBounds,
	getKoreaWeatherMapMosaic,
	isWeatherMapLayer,
	isWeatherMapViewVariant,
	KOREA_DETAIL_MAP_BOUNDS_PADDING,
	KOREA_VIEW_BOUNDS,
	KOREA_WEATHER_MAP_MOSAIC,
	KOREA_WEATHER_MAP_TILE_ALLOWANCE,
	type LatLngBoundsLiteral,
	WEATHER_MAP_LAYER_LABEL,
	WEATHER_MAP_LAYERS,
	WEATHER_MAP_TILE_BASE_URL,
	WEATHER_MAP_TILE_SIZE,
	WEATHER_MAP_VIEW_VARIANTS,
	WEATHER_MAP_ZOOM,
	type WeatherMapLayer,
	type WeatherMapMosaic,
	type WeatherMapTileCoord,
	type WeatherMapTimeSlot,
	type WeatherMapViewVariant
}
