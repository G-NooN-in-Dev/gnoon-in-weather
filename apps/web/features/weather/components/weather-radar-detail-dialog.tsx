'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'

import WeatherMapPanel from '@/features/weather/components/weather-map-panel'
import type { WeatherMapLayer } from '@/lib/weather/weather-map'

/* eslint-disable no-unused-vars -- props 콜백 시그니처의 파라미터명은 문서용입니다. */
type WeatherRadarDetailDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	layer: WeatherMapLayer
	onLayerChange: (layer: WeatherMapLayer) => void
	overlayUrl: string | null
	waitingForFrame: boolean
	frameHint?: string | null
	preloadError: string | null
	timeline: {
		slotLabel: string
		slotCount: number
		safeSlotIndex: number
		onSlotIndexChange: (index: number) => void
		isPreloading: boolean
		loadedForLayer: number
	}
}
/* eslint-enable no-unused-vars */

/**
 * 한반도 날씨 맵 자세히 보기 Dialog.
 * 트리거 버튼 + 시간 슬라이더가 있는 상세 패널을 묶습니다.
 */
function WeatherRadarDetailDialog({
	open,
	onOpenChange,
	layer,
	onLayerChange,
	overlayUrl,
	waitingForFrame,
	frameHint,
	preloadError,
	timeline
}: WeatherRadarDetailDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						className="text-pastel-blue-700 hover:text-pastel-blue-800 shrink-0 hover:bg-transparent"
					/>
				}
			>
				자세히 보기 &gt;
			</DialogTrigger>
			<DialogContent
				className="max-h-[min(90dvh,calc(100dvh-2rem))] overflow-y-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl"
				showCloseButton
			>
				<DialogHeader>
					<DialogTitle>기상 레이더</DialogTitle>
					<DialogDescription hidden />
				</DialogHeader>
				{open ? (
					<WeatherMapPanel
						layer={layer}
						onLayerChange={onLayerChange}
						overlayUrl={overlayUrl}
						waitingForFrame={waitingForFrame}
						frameHint={frameHint}
						preloadError={preloadError}
						// 탭·슬라이더 등 크롬(~20rem)을 빼고, 짧은 뷰포트에서도 맵이 Dialog를 밀지 않게 합니다.
						mapClassName="h-[min(45dvh,20rem)] sm:h-[min(calc(90dvh-20rem),28rem)] lg:h-[min(calc(90dvh-20rem),36rem)]"
						viewVariant="detail"
						layoutNonce={open}
						timeline={timeline}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	)
}

export default WeatherRadarDetailDialog
