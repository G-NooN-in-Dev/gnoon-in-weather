'use client'

import { Label } from '@shared/ui/label'
import { Slider } from '@shared/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { AlertCircle } from 'lucide-react'

import KoreaWeatherMap from '@/features/weather/components/korea-weather-map'
import WeatherApiCredit from '@/features/weather/components/weather-api-credit'
import WeatherMapColorScale from '@/features/weather/components/weather-map-color-scale'
import {
	WEATHER_MAP_LAYER_LABEL,
	WEATHER_MAP_LAYERS,
	type WeatherMapLayer,
	type WeatherMapViewVariant
} from '@/lib/weather/weather-map'

/** 베이스 지도가 비치도록 낮춘 오버레이 투명도 */
const OVERLAY_OPACITY = 0.7

/* eslint-disable no-unused-vars -- props 콜백 시그니처의 파라미터명은 문서용입니다. */
type WeatherMapPanelProps = {
	layer: WeatherMapLayer
	onLayerChange: (layer: WeatherMapLayer) => void
	overlayUrl: string | null
	waitingForFrame: boolean
	frameHint?: string | null
	preloadError: string | null
	mapClassName: string
	viewVariant: WeatherMapViewVariant
	layoutNonce?: number | string | boolean
	/** Dialog 전용: 시간 슬라이더 */
	timeline?: {
		slotLabel: string
		slotCount: number
		safeSlotIndex: number
		onSlotIndexChange: (index: number) => void
		isPreloading: boolean
		loadedForLayer: number
	} | null
}
/* eslint-enable no-unused-vars */

/**
 * 레이어 탭 + 지도 (+ 선택적 시간 슬라이더).
 * 카드 미리보기와 Dialog 상세에서 공통으로 씁니다.
 */
function WeatherMapPanel({
	layer,
	onLayerChange,
	overlayUrl,
	waitingForFrame,
	frameHint,
	preloadError,
	mapClassName,
	viewVariant,
	layoutNonce,
	timeline = null
}: WeatherMapPanelProps) {
	return (
		<div className="flex flex-col gap-4">
			<Tabs
				value={layer}
				onValueChange={(next) => {
					if (next && (WEATHER_MAP_LAYERS as readonly string[]).includes(next)) {
						onLayerChange(next as WeatherMapLayer)
					}
				}}
			>
				<TabsList className="w-full">
					{WEATHER_MAP_LAYERS.map((id) => (
						<TabsTrigger key={id} value={id} className="flex-1">
							{WEATHER_MAP_LAYER_LABEL[id]}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<div className="relative">
				<KoreaWeatherMap
					overlayImageUrl={overlayUrl}
					opacity={OVERLAY_OPACITY}
					mapClassName={mapClassName}
					viewVariant={viewVariant}
					layoutNonce={layoutNonce}
				/>
				{waitingForFrame ? (
					<div className="bg-grayscale-900/20 absolute inset-0 flex items-center justify-center rounded-md">
						<span className="text-grayscale-700 rounded-md bg-white/90 px-3 py-1.5 text-sm">
							{frameHint ?? '맵 불러오는 중…'}
						</span>
					</div>
				) : null}
			</div>

			{/* 레이어 탭에 맞춰 기온·강수·기압 공식 색상 척도 표시 */}
			<WeatherMapColorScale layer={layer} viewVariant={viewVariant} />

			{preloadError ? (
				<p className="text-danger flex items-center gap-2 text-sm">
					<AlertCircle className="text-danger size-4" />
					<span className="font-medium">날씨 맵 오류</span>
					<span>{preloadError}</span>
				</p>
			) : null}

			{timeline && timeline.slotCount > 0 ? (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium">시간</Label>
						<span className="text-grayscale-700 text-sm tabular-nums">{timeline.slotLabel}</span>
					</div>
					<Slider
						min={0}
						max={timeline.slotCount - 1}
						step={1}
						value={[timeline.safeSlotIndex]}
						onValueChange={(value) => {
							const next = Array.isArray(value) ? value[0] : value
							if (typeof next === 'number') {
								timeline.onSlotIndexChange(next)
							}
						}}
						aria-label="날씨 맵 시간"
					/>
					<p className="text-grayscale-500 text-xs">
						UTC 기준 향후 72시간 · 표시는 한국 시간
						{timeline.isPreloading
							? ` · 로딩중 ${timeline.loadedForLayer}/${timeline.slotCount}`
							: timeline.loadedForLayer > 0
								? ' · 로드 완료'
								: ''}
					</p>
				</div>
			) : null}

			<WeatherApiCredit />
		</div>
	)
}

export default WeatherMapPanel
