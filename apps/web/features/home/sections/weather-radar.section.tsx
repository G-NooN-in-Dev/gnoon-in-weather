'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'

import WeatherMapPanel from '@/features/weather/components/weather-map-panel'
import WeatherRadarDetailDialog from '@/features/weather/components/weather-radar-detail-dialog'
import useWeatherRadarMap from '@/features/weather/hooks/use-weather-radar-map'

/**
 * 한반도 고정 날씨 맵 섹션.
 * 프레임 로드·캐시는 `useWeatherRadarMap`에 두고, 여기서는 카드·Dialog만 조립합니다.
 */
function WeatherRadarSection() {
	const { layer, onLayerChange, dialogOpen, onDialogOpenChange, preview, detail } = useWeatherRadarMap()

	return (
		<section>
			<Card className="gap-0 py-4">
				<CardHeader className="gap-2">
					<div className="flex items-start justify-between gap-3">
						<CardTitle className="text-xl font-bold">기상 레이더</CardTitle>
						<WeatherRadarDetailDialog
							open={dialogOpen}
							onOpenChange={onDialogOpenChange}
							layer={layer}
							onLayerChange={onLayerChange}
							overlayUrl={detail.overlayUrl}
							waitingForFrame={detail.waitingForFrame}
							frameHint={detail.frameHint}
							preloadError={detail.preloadError}
							timeline={detail.timeline}
						/>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{preview.timeLabel ? <p className="text-grayscale-600 text-sm tabular-nums">{preview.timeLabel}</p> : null}
					<WeatherMapPanel
						layer={layer}
						onLayerChange={onLayerChange}
						overlayUrl={preview.overlayUrl}
						waitingForFrame={preview.waitingForFrame}
						frameHint="미리보기 불러오는 중…"
						preloadError={preview.preloadError}
						mapClassName="h-72"
						viewVariant="preview"
						timeline={null}
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default WeatherRadarSection
