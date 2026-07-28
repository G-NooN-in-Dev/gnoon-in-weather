import { formatPrecipitationUnitLabel, formatTemperatureLabel } from '@/features/weather/lib/format-weather-values'
import { WEATHER_MAP_TILE_BASE_URL, type WeatherMapLayer, type WeatherMapViewVariant } from '@/lib/weather/weather-map'
import type { WeatherUnits } from '@/types/weather-units.type'

/**
 * WeatherAPI 공식 범례 기준 척도 메타.
 * 스크린샷에서 측정한 눈금 위치·수치를 기준으로 합니다.
 */

/** 공식 PNG에서 색 바만 남기기 위한 콘텐츠 비율 */
type WeatherMapLegendCrop = {
	widthRatio: number
	heightRatio: number
}

type WeatherMapColorScaleDefinition = {
	legendImageUrl: string
	minMetric: number
	maxMetric: number
	/** 상세(Dialog)에서 표시할 눈금 (메트릭) */
	tickMetrics: readonly number[]
	/** 미리보기(좁은 카드)에서 표시할 눈금 — 겹침 방지 */
	previewTickMetrics: readonly number[]
	crop: WeatherMapLegendCrop
}

type WeatherMapColorScaleTick = {
	/** 0–100, 색 바 왼쪽 기준 (메트릭 선형 보간) */
	percent: number
	label: string
}

type WeatherMapColorScaleView = {
	legendImageUrl: string
	crop: WeatherMapLegendCrop
	unitLabel: string
	imageAlt: string
	ticks: WeatherMapColorScaleTick[]
}

/**
 * 원본 범례 스크린샷 기준.
 * 강수 눈금은 0·4·8·16·32·64가 선형 위치(≈0·6·12·25·50·100%) — 등간격 배치가 아님.
 */
const WEATHER_MAP_COLOR_SCALE_BY_LAYER = {
	tmp2m: {
		legendImageUrl: `${WEATHER_MAP_TILE_BASE_URL}/img/legend_temp_gradient.png`,
		minMetric: -50,
		maxMetric: 40,
		tickMetrics: [-50, -20, 0, 10, 20, 30, 40],
		previewTickMetrics: [-50, -20, 0, 20, 40],
		crop: { widthRatio: 875 / 900, heightRatio: 53 / 130 }
	},
	precip: {
		legendImageUrl: `${WEATHER_MAP_TILE_BASE_URL}/img/legend_precip_gradient.png`,
		minMetric: 0,
		maxMetric: 64,
		tickMetrics: [0, 4, 8, 16, 32, 64],
		previewTickMetrics: [0, 8, 16, 32, 64],
		crop: { widthRatio: 975 / 1000, heightRatio: 63 / 140 }
	},
	pressure: {
		legendImageUrl: `${WEATHER_MAP_TILE_BASE_URL}/img/legend_pressure_gradient.png`,
		minMetric: 940,
		maxMetric: 1040,
		tickMetrics: [940, 960, 980, 990, 1000, 1010, 1020, 1030, 1040],
		// 미리보기 폭이 좁아 끝·중간만 표시
		previewTickMetrics: [940, 980, 1000, 1020, 1040],
		crop: { widthRatio: 975 / 1000, heightRatio: 63 / 140 }
	}
} as const satisfies Record<WeatherMapLayer, WeatherMapColorScaleDefinition>

function celsiusToFahrenheit(celsius: number) {
	return (celsius * 9) / 5 + 32
}

function mmToInch(mm: number) {
	return Math.round((mm / 25.4) * 100) / 100
}

function formatScaleNumber(value: number, fractionDigits: number) {
	return new Intl.NumberFormat('ko-KR', {
		maximumFractionDigits: fractionDigits,
		minimumFractionDigits: 0
	}).format(value)
}

/** 메트릭 값 → 색 바 가로 위치(%) — 원본과 같이 min~max 선형 */
function metricToPercent(metric: number, minMetric: number, maxMetric: number) {
	if (maxMetric === minMetric) {
		return 0
	}
	return ((metric - minMetric) / (maxMetric - minMetric)) * 100
}

function convertTickValue(layer: WeatherMapLayer, metric: number, units: WeatherUnits) {
	if (layer === 'tmp2m') {
		const useFahrenheit = units.temperature === 'f'
		return {
			value: useFahrenheit ? celsiusToFahrenheit(metric) : metric,
			fractionDigits: 0
		}
	}

	if (layer === 'precip') {
		const useInch = units.precipitation === 'inch'
		return {
			value: useInch ? mmToInch(metric) : metric,
			fractionDigits: useInch ? 2 : 0
		}
	}

	return { value: metric, fractionDigits: 0 }
}

function unitLabelForLayer(layer: WeatherMapLayer, units: WeatherUnits) {
	if (layer === 'tmp2m') {
		return formatTemperatureLabel(units)
	}
	if (layer === 'precip') {
		return `${formatPrecipitationUnitLabel(units)}/h`
	}
	return 'hPa'
}

/**
 * 단위 설정·화면 종류에 맞춰 눈금 라벨을 만듭니다.
 * 타일 색은 메트릭 고정이므로 숫자만 표시용으로 변환합니다.
 */
function getWeatherMapColorScaleView(
	layer: WeatherMapLayer,
	units: WeatherUnits,
	viewVariant: WeatherMapViewVariant = 'detail'
): WeatherMapColorScaleView {
	const definition = WEATHER_MAP_COLOR_SCALE_BY_LAYER[layer]
	const { legendImageUrl, minMetric, maxMetric, tickMetrics, previewTickMetrics, crop } = definition
	const metrics = viewVariant === 'preview' ? previewTickMetrics : tickMetrics
	const unitLabel = unitLabelForLayer(layer, units)

	const ticks = metrics.map((metric) => {
		const { value, fractionDigits } = convertTickValue(layer, metric, units)
		return {
			percent: metricToPercent(metric, minMetric, maxMetric),
			label: formatScaleNumber(value, fractionDigits)
		}
	})

	const titleByLayer = {
		tmp2m: '기온',
		precip: '강수',
		pressure: '기압'
	} as const satisfies Record<WeatherMapLayer, string>

	return {
		legendImageUrl,
		crop,
		unitLabel,
		imageAlt: `${titleByLayer[layer]} 색상 척도 (${unitLabel})`,
		ticks
	}
}

export {
	getWeatherMapColorScaleView,
	WEATHER_MAP_COLOR_SCALE_BY_LAYER,
	type WeatherMapColorScaleDefinition,
	type WeatherMapColorScaleTick,
	type WeatherMapColorScaleView,
	type WeatherMapLegendCrop
}
