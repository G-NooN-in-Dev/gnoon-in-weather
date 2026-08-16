'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
	ensureWeatherMapFrame,
	preloadWeatherMapFrames,
	revokeWeatherMapFrameUrls
} from '@/features/weather/lib/preload-weather-map-frames'
import useIsClient from '@/hooks/use-is-client'
import {
	buildWeatherMapFrameKey,
	createWeatherMapTimeSlots,
	formatWeatherMapSlotLabel,
	type WeatherMapLayer
} from '@/lib/weather/weather-map'

/** 홈 카드·Dialog가 공유하는 날씨 맵 프레임 로드 상태 */
type WeatherRadarMapState = {
	layer: WeatherMapLayer
	onLayerChange: (layer: WeatherMapLayer) => void
	dialogOpen: boolean
	onDialogOpenChange: (open: boolean) => void
	preview: {
		timeLabel: string | null
		overlayUrl: string | null
		waitingForFrame: boolean
		preloadError: string | null
	}
	detail: {
		overlayUrl: string | null
		waitingForFrame: boolean
		frameHint: string
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
}

/**
 * 한반도 날씨 맵(카드 미리보기 + Dialog 상세) 상태·프레임 캐시를 관리합니다.
 * 섹션은 이 훅 결과만 받아 렌더링합니다.
 */
function useWeatherRadarMap(): WeatherRadarMapState {
	const isClient = useIsClient()
	const [layer, setLayer] = useState<WeatherMapLayer>('tmp2m')
	const [slotIndex, setSlotIndex] = useState(0)
	const [frameUrls, setFrameUrls] = useState<Record<string, string>>({})
	const [previewError, setPreviewError] = useState<string | null>(null)
	const [detailError, setDetailError] = useState<string | null>(null)
	const [dialogOpen, setDialogOpen] = useState(false)

	const frameUrlsRef = useRef(frameUrls)

	useEffect(() => {
		frameUrlsRef.current = frameUrls
	}, [frameUrls])

	const slots = useMemo(() => (isClient ? createWeatherMapTimeSlots(72) : []), [isClient])
	const previewSlot = slots[0] ?? null

	const safeSlotIndex = slots.length === 0 ? 0 : Math.min(slotIndex, slots.length - 1)
	const detailSlot = slots[safeSlotIndex] ?? null

	const previewKey = previewSlot
		? buildWeatherMapFrameKey(layer, previewSlot.dateKey, previewSlot.hourKey, 'preview')
		: null
	const detailKey = detailSlot ? buildWeatherMapFrameKey(layer, detailSlot.dateKey, detailSlot.hourKey, 'detail') : null

	const previewUrl = previewKey ? (frameUrls[previewKey] ?? null) : null
	const detailUrl = detailKey ? (frameUrls[detailKey] ?? null) : null

	const loadedForLayer = useMemo(() => {
		return slots.filter((slot) =>
			Boolean(frameUrls[buildWeatherMapFrameKey(layer, slot.dateKey, slot.hourKey, 'detail')])
		).length
	}, [frameUrls, layer, slots])

	const isDetailPreloading = dialogOpen && slots.length > 0 && loadedForLayer < slots.length
	const waitingPreview = Boolean(previewKey && !previewUrl && !previewError)
	const waitingDetail = Boolean(dialogOpen && detailKey && !detailUrl && !detailError)

	const putFrame = (frameKey: string, objectUrl: string) => {
		setFrameUrls((prev) => {
			if (prev[frameKey]) {
				URL.revokeObjectURL(objectUrl)
				return prev
			}
			return { ...prev, [frameKey]: objectUrl }
		})
	}

	// 카드용: 첫 시간대 프레임만 로드 (페이지를 막지 않음)
	useEffect(() => {
		if (!previewSlot) {
			return
		}

		const controller = new AbortController()

		void (async () => {
			try {
				await ensureWeatherMapFrame({
					layer,
					slot: previewSlot,
					variant: 'preview',
					isCached: (key) => Boolean(frameUrlsRef.current[key]),
					onReady: (key, url) => {
						putFrame(key, url)
						setPreviewError(null)
					},
					signal: controller.signal
				})
			} catch (error: unknown) {
				if (controller.signal.aborted) {
					return
				}
				setPreviewError(error instanceof Error ? error.message : '날씨 맵을 불러오지 못했습니다.')
			}
		})()

		return () => {
			controller.abort()
		}
	}, [layer, previewSlot])

	// Dialog용: 열렸을 때만 전체 시간대 프리로드
	useEffect(() => {
		if (!dialogOpen || slots.length === 0) {
			return
		}

		const controller = new AbortController()

		void (async () => {
			try {
				await preloadWeatherMapFrames({
					layer,
					slots,
					variant: 'detail',
					signal: controller.signal,
					isCached: (frameKey) => Boolean(frameUrlsRef.current[frameKey]),
					onFrameReady: (frameKey, objectUrl) => {
						putFrame(frameKey, objectUrl)
						setDetailError(null)
					}
				})
			} catch (error: unknown) {
				if (controller.signal.aborted) {
					return
				}
				setDetailError(error instanceof Error ? error.message : '날씨 맵을 불러오지 못했습니다.')
			}
		})()

		return () => {
			controller.abort()
		}
	}, [dialogOpen, layer, slots])

	// 언마운트 시 Blob URL 정리
	useEffect(() => {
		return () => {
			revokeWeatherMapFrameUrls(frameUrlsRef.current)
		}
	}, [])

	const onDialogOpenChange = (open: boolean) => {
		setDialogOpen(open)
		if (!open) {
			// 카드는 항상 첫 시간대만 보여 주므로 Dialog를 닫으면 인덱스를 되돌립니다.
			setSlotIndex(0)
		}
	}

	return {
		layer,
		onLayerChange: setLayer,
		dialogOpen,
		onDialogOpenChange,
		preview: {
			timeLabel: previewSlot ? formatWeatherMapSlotLabel(previewSlot.epochMs) : null,
			overlayUrl: previewUrl,
			waitingForFrame: waitingPreview,
			preloadError: waitingPreview ? null : previewError
		},
		detail: {
			overlayUrl: detailUrl,
			waitingForFrame: waitingDetail,
			frameHint: isDetailPreloading ? `프레임 준비 중… (${loadedForLayer}/${slots.length})` : '맵 불러오는 중…',
			preloadError: waitingDetail ? null : detailError,
			timeline: {
				slotLabel: detailSlot ? formatWeatherMapSlotLabel(detailSlot.epochMs) : '—',
				slotCount: slots.length,
				safeSlotIndex,
				onSlotIndexChange: setSlotIndex,
				isPreloading: isDetailPreloading,
				loadedForLayer
			}
		}
	}
}

export default useWeatherRadarMap
