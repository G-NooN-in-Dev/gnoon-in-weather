import {
	getKoreaWeatherMapMosaic,
	WEATHER_MAP_TILE_SIZE,
	type WeatherMapLayer,
	type WeatherMapViewVariant
} from '@/lib/weather/weather-map'

/** 앱 프록시 타일 URL (CORS 회피) */
function buildProxiedTileUrl(
	layer: WeatherMapLayer,
	dateKey: string,
	hourKey: string,
	x: number,
	y: number,
	z: number
) {
	const params = new URLSearchParams({
		layer,
		date: dateKey,
		hour: hourKey,
		z: String(z),
		x: String(x),
		y: String(y)
	})
	return `/api/weather/maps/tile?${params.toString()}`
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.decoding = 'async'
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error(`타일 이미지를 불러오지 못했습니다: ${src}`))
		image.src = src
	})
}

function canvasToObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((result) => {
			if (result) {
				resolve(URL.createObjectURL(result))
			} else {
				reject(new Error('날씨 맵 이미지 합성에 실패했습니다.'))
			}
		}, 'image/png')
	})
}

/**
 * 뷰(variant)에 맞춰 타일을 이어 붙인 뒤 크롭한 PNG Blob URL을 만듭니다.
 * preview = 메인 카드, detail = Dialog(대한민국 전역).
 */
async function stitchKoreaWeatherMapImage(
	layer: WeatherMapLayer,
	dateKey: string,
	hourKey: string,
	variant: WeatherMapViewVariant = 'preview'
): Promise<string> {
	const mosaic = getKoreaWeatherMapMosaic(variant)
	const mosaicCanvas = document.createElement('canvas')
	mosaicCanvas.width = mosaic.cols * WEATHER_MAP_TILE_SIZE
	mosaicCanvas.height = mosaic.rows * WEATHER_MAP_TILE_SIZE

	const mosaicContext = mosaicCanvas.getContext('2d')
	if (!mosaicContext) {
		throw new Error('Canvas 2D context를 사용할 수 없습니다.')
	}

	const images = await Promise.all(
		mosaic.tiles.map(async (tile) => {
			const { x, y, z } = tile
			const url = buildProxiedTileUrl(layer, dateKey, hourKey, x, y, z)
			const image = await loadImage(url)
			return { tile, image }
		})
	)

	for (const { tile, image } of images) {
		const dx = (tile.x - mosaic.minX) * WEATHER_MAP_TILE_SIZE
		const dy = (tile.y - mosaic.minY) * WEATHER_MAP_TILE_SIZE
		mosaicContext.drawImage(image, dx, dy)
	}

	const { x, y, width, height } = mosaic.viewCrop
	const cropCanvas = document.createElement('canvas')
	cropCanvas.width = Math.max(1, Math.round(width))
	cropCanvas.height = Math.max(1, Math.round(height))

	const cropContext = cropCanvas.getContext('2d')
	if (!cropContext) {
		throw new Error('Canvas 2D context를 사용할 수 없습니다.')
	}

	cropContext.drawImage(mosaicCanvas, x, y, width, height, 0, 0, cropCanvas.width, cropCanvas.height)

	return canvasToObjectUrl(cropCanvas)
}

export { stitchKoreaWeatherMapImage }
