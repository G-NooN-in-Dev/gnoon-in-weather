'use client'

import { cn } from '@shared/ui/utils'
import { useEffect, useRef, useState } from 'react'

import { loadKakaoMapsSdk } from '@/lib/kakao/load-kakao-maps-sdk'
import {
	getKoreaViewBounds,
	KOREA_DETAIL_MAP_BOUNDS_PADDING,
	type WeatherMapViewVariant
} from '@/lib/weather/weather-map'

type KoreaWeatherMapProps = {
	/** 합성된 날씨 오버레이 Blob/URL (없으면 베이스 지도만) */
	overlayImageUrl: string | null
	/** 오버레이 투명도 0~1 */
	opacity?: number
	/** 지도 영역 높이 등 (기본 h-72) */
	mapClassName?: string
	/**
	 * preview: 메인 카드(전역 bounds + 카카오 기본 패딩)
	 * detail: Dialog(전역 bounds + 패딩 0)
	 */
	viewVariant?: WeatherMapViewVariant
	/**
	 * Dialog 오픈 등 컨테이너 크기가 바뀐 뒤 카카오맵 relayout을 다시 돌릴 때 올립니다.
	 */
	layoutNonce?: number | string | boolean
	className?: string
}

/** 뷰 bounds에 맞춰 지도 중심·줌을 맞춥니다. */
function applyViewBounds(map: kakao.maps.Map, bounds: kakao.maps.LatLngBounds, variant: WeatherMapViewVariant) {
	if (variant === 'detail') {
		const { top, right, bottom, left } = KOREA_DETAIL_MAP_BOUNDS_PADDING
		map.setBounds(bounds, top, right, bottom, left)
		return
	}
	// preview: 카카오 기본 패딩(32) 유지
	map.setBounds(bounds)
}

/**
 * 한반도 고정 카카오맵 + WeatherAPI 이미지 오버레이.
 * 확대/축소·드래그는 끄고, 오버레이는 지도 영역 전체에 CSS로 얹습니다.
 */
function KoreaWeatherMap({
	overlayImageUrl,
	opacity = 0.4,
	mapClassName,
	viewVariant = 'preview',
	layoutNonce,
	className
}: KoreaWeatherMapProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<kakao.maps.Map | null>(null)
	const boundsRef = useRef<kakao.maps.LatLngBounds | null>(null)

	const [mapError, setMapError] = useState<string | null>(null)
	/** SDK·Map 생성 완료 후 layoutNonce effect / ResizeObserver가 돌 수 있게 합니다. */
	const [mapReady, setMapReady] = useState(false)

	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		let cancelled = false
		const retryTimeouts: number[] = []

		loadKakaoMapsSdk()
			.then((kakaoMap) => {
				if (cancelled || !containerRef.current) {
					return
				}

				const viewBounds = getKoreaViewBounds(viewVariant)
				const { south, west, north, east } = viewBounds
				const sw = new kakaoMap.maps.LatLng(south, west)
				const ne = new kakaoMap.maps.LatLng(north, east)
				const bounds = new kakaoMap.maps.LatLngBounds(sw, ne)
				boundsRef.current = bounds

				const center = new kakaoMap.maps.LatLng((south + north) / 2, (west + east) / 2)

				const map = new kakaoMap.maps.Map(containerRef.current, {
					center,
					level: 10,
					draggable: false,
					scrollwheel: false,
					disableDoubleClick: true,
					disableDoubleClickZoom: true,
					keyboardShortcuts: false
				})

				applyViewBounds(map, bounds, viewVariant)
				map.setDraggable(false)
				map.setZoomable(false)
				mapRef.current = map
				setMapError(null)
				setMapReady(true)

				const syncView = () => {
					if (cancelled) {
						return
					}
					map.relayout()
					applyViewBounds(map, bounds, viewVariant)
				}

				requestAnimationFrame(syncView)
				// Dialog 애니메이션·레이아웃이 끝난 뒤에도 bounds를 다시 맞춤
				for (const delayMs of [80, 200, 400]) {
					retryTimeouts.push(window.setTimeout(syncView, delayMs))
				}
			})
			.catch((error: unknown) => {
				if (cancelled) {
					return
				}
				setMapError(error instanceof Error ? error.message : '카카오맵을 불러오지 못했습니다.')
			})

		return () => {
			cancelled = true
			for (const id of retryTimeouts) {
				window.clearTimeout(id)
			}
			mapRef.current = null
			boundsRef.current = null
			setMapReady(false)
		}
		// viewVariant는 마운트 시점에 고정 (카드/Dialog가 각각 다른 인스턴스)
		// eslint-disable-next-line react-hooks/exhaustive-deps -- 인스턴스별 variant 고정
	}, [])

	useEffect(() => {
		const map = mapRef.current
		const bounds = boundsRef.current
		const container = containerRef.current
		if (!mapReady || !map || !bounds || layoutNonce === undefined) {
			return
		}

		const syncView = () => {
			map.relayout()
			applyViewBounds(map, bounds, viewVariant)
		}

		const rafId = requestAnimationFrame(syncView)
		const timeoutId = window.setTimeout(syncView, 160)

		const observer = new ResizeObserver(() => {
			syncView()
		})
		if (container) {
			observer.observe(container)
		}

		return () => {
			cancelAnimationFrame(rafId)
			window.clearTimeout(timeoutId)
			observer.disconnect()
		}
	}, [layoutNonce, mapReady, viewVariant])

	return (
		<div className={cn('flex w-full flex-col gap-2', className)}>
			<div className={cn('relative isolate w-full overflow-hidden rounded-md', mapClassName ?? 'h-72')}>
				<div ref={containerRef} className="bg-grayscale-200 absolute inset-0 z-0 size-full" />
				{overlayImageUrl ? (
					// eslint-disable-next-line @next/next/no-img-element -- Blob URL 오버레이
					<img
						src={overlayImageUrl}
						alt="한반도 날씨 오버레이"
						className="pointer-events-none absolute inset-0 z-10 size-full object-fill"
						style={{ opacity }}
					/>
				) : null}
			</div>
			{mapError ? <p className="text-danger text-sm">{mapError}</p> : null}
		</div>
	)
}

export default KoreaWeatherMap
