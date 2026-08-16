'use client'

import { cn } from '@shared/ui/utils'
import { useEffect, useRef, useState } from 'react'

import {
	createAirportMarkerContent,
	setAirportMarkerSelected
} from '@/features/theme-maps/components/airport-marker-content'
import {
	type Airport,
	type AirportKind,
	AIRPORTS,
	getAirportByIata,
	setOnlyInternationalMode
} from '@/features/theme-maps/lib/airports'
import { loadKakaoMapsSdk } from '@/lib/kakao/load-kakao-maps-sdk'

type AirportBoundsMode = 'metro' | 'korea'
/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type AirportSelectHandler = (iata: string) => void
/* eslint-enable no-unused-vars */

/** 목록 페이지 기본 포커스: 인천·김포·원주·청주·양양 일대 */
const METRO_FOCUS_IATAS = ['ICN', 'GMP', 'WJU', 'CJJ', 'YNY'] as const

const METRO_FOCUS_BOUNDS_PADDING = {
	top: 72,
	right: 72,
	bottom: 72,
	left: 72
} as const

/** 사이드 피커처럼 작은 컨테이너에서도 한반도 전체가 들어가도록 패딩을 줄입니다. */
const KOREA_FOCUS_BOUNDS_PADDING = {
	top: 24,
	right: 24,
	bottom: 24,
	left: 24
} as const

const DEFAULT_MARKER_Z_INDEX = 1
const SELECTED_MARKER_Z_INDEX = 10
/** 툴팁이 이웃 마커 오버레이 위에 오도록 호버 중인 마커만 더 올립니다. */
const HOVERED_MARKER_Z_INDEX = 20

type AirportsKakaoMapProps = {
	selectedIata: string | null
	onSelect: AirportSelectHandler
	onClear?: () => void
	/** metro: 수도권 focus, korea: 전체 공항이 한 화면에 들어오도록 고정 */
	boundsMode?: AirportBoundsMode
	/** true면 국제산만. bounds는 바꾸지 않고 마커만 보이거나 숨깁니다. */
	internationalOnly?: boolean
	className?: string
	mapClassName?: string
}

type MarkerEntry = {
	iata: string
	kind: AirportKind
	overlay: kakao.maps.CustomOverlay
	content: HTMLElement
}

function getBoundsAirports(boundsMode: AirportBoundsMode): readonly Airport[] {
	return boundsMode === 'korea'
		? AIRPORTS
		: METRO_FOCUS_IATAS.map((iata) => getAirportByIata(iata)).filter(
				(airport): airport is Airport => airport !== undefined
			)
}

function getBoundsPadding(boundsMode: AirportBoundsMode) {
	return boundsMode === 'korea' ? KOREA_FOCUS_BOUNDS_PADDING : METRO_FOCUS_BOUNDS_PADDING
}

function getMarkerZIndex(iata: string, selectedIata: string | null, hoveredIata: string | null): number {
	if (iata === hoveredIata) {
		return HOVERED_MARKER_Z_INDEX
	}

	return iata === selectedIata ? SELECTED_MARKER_Z_INDEX : DEFAULT_MARKER_Z_INDEX
}

/** 지정 공항들로 LatLngBounds를 만듭니다. */
function createAirportsLatLngBounds(
	kakaoMaps: typeof kakao.maps,
	airports: readonly Airport[]
): kakao.maps.LatLngBounds {
	const seed = airports[0] ?? AIRPORTS[0]
	const { LatLng, LatLngBounds } = kakaoMaps
	const bounds = new LatLngBounds(new LatLng(seed.lat, seed.lng), new LatLng(seed.lat, seed.lng))

	for (const airport of airports) {
		bounds.extend(new LatLng(airport.lat, airport.lng))
	}

	return bounds
}

/**
 * 카카오맵 + 공항 Plane CustomOverlay 마커.
 * boundsMode에 따라 초기 뷰만 정하고, internationalOnly 변경 시에는 줌을 유지합니다.
 */
function AirportsKakaoMap({
	selectedIata,
	onSelect,
	onClear,
	boundsMode = 'metro',
	internationalOnly = false,
	className,
	mapClassName
}: AirportsKakaoMapProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<kakao.maps.Map | null>(null)
	const markersRef = useRef<MarkerEntry[]>([])
	const onSelectRef = useRef(onSelect)
	const onClearRef = useRef(onClear)
	const selectedIataRef = useRef(selectedIata)
	const hoveredIataRef = useRef<string | null>(null)
	const internationalOnlyRef = useRef(internationalOnly)

	const [mapError, setMapError] = useState<string | null>(null)
	const [mapReady, setMapReady] = useState(false)

	useEffect(() => {
		onSelectRef.current = onSelect
		onClearRef.current = onClear
		selectedIataRef.current = selectedIata
		internationalOnlyRef.current = internationalOnly
	}, [onSelect, onClear, selectedIata, internationalOnly])

	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		let cancelled = false
		let mapClickHandler: (() => void) | null = null

		void (async () => {
			try {
				const kakaoMap = await loadKakaoMapsSdk()
				if (cancelled || !containerRef.current) {
					return
				}

				const { maps } = kakaoMap

				const boundsAirports = getBoundsAirports(boundsMode)
				const { top, right, bottom, left } = getBoundsPadding(boundsMode)
				const bounds = createAirportsLatLngBounds(maps, boundsAirports)
				const southWest = bounds.getSouthWest()
				const northEast = bounds.getNorthEast()

				const { CustomOverlay, LatLng, Map, event } = maps

				const center = new LatLng(
					(southWest.getLat() + northEast.getLat()) / 2,
					(southWest.getLng() + northEast.getLng()) / 2
				)

				const map = new Map(containerRef.current, {
					center,
					level: 10,
					draggable: true,
					scrollwheel: true,
					disableDoubleClickZoom: false,
					keyboardShortcuts: true
				})

				map.setBounds(bounds, top, right, bottom, left)
				mapRef.current = map

				const markers: MarkerEntry[] = AIRPORTS.map((airport) => {
					const overlayHolder: { overlay: kakao.maps.CustomOverlay | null } = { overlay: null }

					const { iata, kind, lat, lng, name } = airport

					const content = createAirportMarkerContent(
						{ iata, kind, lat, lng, name },
						(iata) => {
							onSelectRef.current(iata)
						},
						(hovered) => {
							const overlay = overlayHolder.overlay
							if (!overlay) {
								return
							}

							hoveredIataRef.current = hovered ? iata : hoveredIataRef.current === iata ? null : hoveredIataRef.current
							overlay.setZIndex(getMarkerZIndex(iata, selectedIataRef.current, hoveredIataRef.current))
						}
					)

					const visibleMode = setOnlyInternationalMode(kind, internationalOnlyRef.current)

					const overlay = new CustomOverlay({
						map: visibleMode ? map : null,
						clickable: true,
						content,
						position: new LatLng(lat, lng),
						xAnchor: 0.5,
						yAnchor: 0.5,
						zIndex: DEFAULT_MARKER_Z_INDEX
					})
					overlayHolder.overlay = overlay

					return { iata, kind, overlay, content }
				})

				markersRef.current = markers

				mapClickHandler = () => {
					onClearRef.current?.()
				}
				event.addListener(map, 'click', mapClickHandler)

				requestAnimationFrame(() => {
					if (cancelled) {
						return
					}
					map.relayout()
					map.setBounds(bounds, top, right, bottom, left)
				})

				setMapError(null)
				setMapReady(true)
			} catch (error: unknown) {
				if (cancelled) {
					return
				}
				setMapError(error instanceof Error ? error.message : '카카오맵을 불러오지 못했습니다.')
			}
		})()

		return () => {
			cancelled = true

			const map = mapRef.current
			if (map && mapClickHandler && window.kakao?.maps?.event) {
				window.kakao.maps.event.removeListener(map, 'click', mapClickHandler)
			}

			for (const marker of markersRef.current) {
				marker.overlay.setMap(null)
			}
			markersRef.current = []
			hoveredIataRef.current = null
			mapRef.current = null
			setMapReady(false)
		}
	}, [boundsMode])

	useEffect(() => {
		if (!mapReady) {
			return
		}

		const map = mapRef.current
		if (!map) {
			return
		}

		hoveredIataRef.current = null

		for (const marker of markersRef.current) {
			const visibleMode = setOnlyInternationalMode(marker.kind, internationalOnly)

			marker.overlay.setMap(visibleMode ? map : null)
			marker.overlay.setZIndex(getMarkerZIndex(marker.iata, selectedIataRef.current, null))
		}
	}, [mapReady, internationalOnly])

	useEffect(() => {
		if (!mapReady) {
			return
		}

		for (const marker of markersRef.current) {
			const selected = marker.iata === selectedIata
			setAirportMarkerSelected(marker.content, selected)
			marker.overlay.setZIndex(getMarkerZIndex(marker.iata, selectedIata, hoveredIataRef.current))
		}
	}, [mapReady, selectedIata])

	useEffect(() => {
		const map = mapRef.current
		const container = containerRef.current
		if (!mapReady || !map || !container) {
			return
		}

		const syncLayout = () => {
			map.relayout()
		}

		const observer = new ResizeObserver(syncLayout)
		observer.observe(container)
		requestAnimationFrame(syncLayout)

		return () => {
			observer.disconnect()
		}
	}, [mapReady])

	return (
		<div className={cn('relative flex size-full flex-col', className)}>
			<div className={cn('relative isolate size-full overflow-hidden', mapClassName)}>
				<div ref={containerRef} className="bg-grayscale-200 absolute inset-0 z-0 size-full" />
			</div>
			{mapError ? (
				<p className="bg-background/90 text-danger absolute bottom-3 left-3 z-10 rounded-md px-3 py-2 text-sm shadow-sm">
					{mapError}
				</p>
			) : null}
		</div>
	)
}

export default AirportsKakaoMap
