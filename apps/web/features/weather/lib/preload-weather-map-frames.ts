import { stitchKoreaWeatherMapImage } from '@/features/weather/lib/stitch-weather-map-image'
import {
	buildWeatherMapFrameKey,
	type WeatherMapLayer,
	type WeatherMapTimeSlot,
	type WeatherMapViewVariant
} from '@/lib/weather/weather-map'

/* eslint-disable no-unused-vars -- 콜백 타입 시그니처의 파라미터명은 문서용입니다. */
type EnsureWeatherMapFrameOptions = {
	layer: WeatherMapLayer
	slot: WeatherMapTimeSlot
	variant: WeatherMapViewVariant
	/** 이미 캐시된 프레임인지 (레이어 전환 시 재사용) */
	isCached: (frameKey: string) => boolean
	/** 새 프레임 Blob URL이 준비됐을 때 */
	onReady: (frameKey: string, objectUrl: string) => void
	signal?: AbortSignal
}

type PreloadWeatherMapFramesOptions = {
	layer: WeatherMapLayer
	slots: WeatherMapTimeSlot[]
	/** preview=카드, detail=Dialog */
	variant?: WeatherMapViewVariant
	/** 이미 캐시된 프레임인지 (레이어 전환 시 재사용) */
	isCached: (frameKey: string) => boolean
	/** 새 프레임 Blob URL이 준비됐을 때 */
	onFrameReady: (frameKey: string, objectUrl: string) => void
	concurrency?: number
	signal?: AbortSignal
}
/* eslint-enable no-unused-vars */

/**
 * 단일 프레임을 캐시에 넣고, 이미 있으면 재사용합니다.
 * 카드 미리보기(1장)와 다장 프리로드의 공통 단위입니다.
 */
async function ensureWeatherMapFrame({
	layer,
	slot,
	variant,
	isCached,
	onReady,
	signal
}: EnsureWeatherMapFrameOptions) {
	const { dateKey, hourKey } = slot
	const key = buildWeatherMapFrameKey(layer, dateKey, hourKey, variant)

	if (isCached(key) || signal?.aborted) {
		return
	}

	const url = await stitchKoreaWeatherMapImage(layer, dateKey, hourKey, variant)

	if (signal?.aborted) {
		URL.revokeObjectURL(url)
		return
	}
	onReady(key, url)
}

/**
 * 시간대 프레임을 병렬로 미리 합성합니다.
 * 첫 슬롯을 우선 처리한 뒤 나머지를 채워, 슬라이더를 슬라이드쇼처럼 쓰게 합니다.
 */
async function preloadWeatherMapFrames({
	layer,
	slots,
	variant = 'detail',
	isCached,
	onFrameReady,
	concurrency = 3,
	signal
}: PreloadWeatherMapFramesOptions): Promise<void> {
	const total = slots.length
	if (total === 0) {
		return
	}

	const loadOne = (slot: WeatherMapTimeSlot) =>
		ensureWeatherMapFrame({
			layer,
			slot,
			variant,
			isCached,
			onReady: onFrameReady,
			signal
		})

	const firstSlot = slots[0]
	if (!firstSlot) {
		return
	}

	await loadOne(firstSlot)

	let nextIndex = 1
	const workers = Array.from({ length: Math.min(concurrency, Math.max(0, total - 1)) }, async () => {
		while (nextIndex < total) {
			if (signal?.aborted) {
				return
			}
			const index = nextIndex
			nextIndex += 1
			const slot = slots[index]
			if (!slot) {
				return
			}
			try {
				await loadOne(slot)
			} catch {
				// 개별 프레임 실패는 전체 프리로드를 막지 않음
			}
		}
	})

	await Promise.all(workers)
}

/** 프레임 URL 맵에 담긴 Blob URL을 모두 해제합니다. */
function revokeWeatherMapFrameUrls(frameUrls: Record<string, string>) {
	for (const url of Object.values(frameUrls)) {
		URL.revokeObjectURL(url)
	}
}

export { ensureWeatherMapFrame, preloadWeatherMapFrames, revokeWeatherMapFrameUrls }
