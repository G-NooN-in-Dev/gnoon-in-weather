'use client'

import { cn } from '@shared/ui/utils'
import { useEffect, useRef, useState } from 'react'

import {
	createAirportMarkerContent,
	setAirportMarkerSelected
} from '@/features/theme-maps/components/airport-marker-content'
import { AIRPORTS, getAirportByIata } from '@/features/theme-maps/lib/airports'
import { loadKakaoMapsSdk } from '@/lib/kakao/load-kakao-maps-sdk'

/** 기본 포커스: 인천·김포·원주·청주·양양 일대가 한 화면에 들어오는 줌 */
const DEFAULT_FOCUS_IATAS = ['ICN', 'GMP', 'WJU', 'CJJ', 'YNY'] as const

const DEFAULT_FOCUS_BOUNDS_PADDING = {
	top: 72,
	right: 72,
	bottom: 72,
	left: 72
} as const

type AirportSelectHandler = (iata: string) => void

type AirportsKakaoMapProps = {
	selectedIata: string | null
	onSelect: AirportSelectHandler
	onClear: () => void
	className?: string
	mapClassName?: string
}

type MarkerEntry = {
	iata: string
	overlay: kakao.maps.CustomOverlay
	content: HTMLElement
}

/** 지정 IATA 공항들로 LatLngBounds를 만듭니다. */
function createFocusLatLngBounds(kakaoMaps: typeof kakao.maps, iatas: readonly string[]): kakao.maps.LatLngBounds {
	const airports = iatas
		.map((iata) => getAirportByIata(iata))
		.filter((airport): airport is NonNullable<typeof airport> => airport !== undefined)

	const seed = airports[0] ?? AIRPORTS[0]
	const bounds = new kakaoMaps.LatLngBounds(
		new kakaoMaps.LatLng(seed.lat, seed.lng),
		new kakaoMaps.LatLng(seed.lat, seed.lng)
	)

	for (const airport of airports) {
		bounds.extend(new kakaoMaps.LatLng(airport.lat, airport.lng))
	}

	return bounds
}

/**
 * 카카오맵 + 공항 Plane CustomOverlay 마커.
 * 초기 뷰는 인천·김포·원주·청주·양양 일대를 기준으로 맞춥니다.
 */
function AirportsKakaoMap({ selectedIata, onSelect, onClear, className, mapClassName }: AirportsKakaoMapProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<kakao.maps.Map | null>(null)
	const markersRef = useRef<MarkerEntry[]>([])
	const onSelectRef = useRef(onSelect)
	const onClearRef = useRef(onClear)

	const [mapError, setMapError] = useState<string | null>(null)
	const [mapReady, setMapReady] = useState(false)

	useEffect(() => {
		onSelectRef.current = onSelect
		onClearRef.current = onClear
	}, [onSelect, onClear])

	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		let cancelled = false
		let mapClickHandler: (() => void) | null = null

		loadKakaoMapsSdk()
			.then((kakaoMap) => {
				if (cancelled || !containerRef.current) {
					return
				}

				const bounds = createFocusLatLngBounds(kakaoMap.maps, DEFAULT_FOCUS_IATAS)
				const { top, right, bottom, left } = DEFAULT_FOCUS_BOUNDS_PADDING
				const sw = bounds.getSouthWest()
				const ne = bounds.getNorthEast()
				const center = new kakaoMap.maps.LatLng((sw.getLat() + ne.getLat()) / 2, (sw.getLng() + ne.getLng()) / 2)

				const map = new kakaoMap.maps.Map(containerRef.current, {
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
					const content = createAirportMarkerContent(airport, (iata) => {
						onSelectRef.current(iata)
					})
					const overlay = new kakaoMap.maps.CustomOverlay({
						map,
						clickable: true,
						content,
						position: new kakaoMap.maps.LatLng(airport.lat, airport.lng),
						xAnchor: 0.5,
						yAnchor: 0.5,
						zIndex: 1
					})

					return { iata: airport.iata, overlay, content }
				})

				markersRef.current = markers

				mapClickHandler = () => {
					onClearRef.current()
				}
				kakaoMap.maps.event.addListener(map, 'click', mapClickHandler)

				requestAnimationFrame(() => {
					if (cancelled) {
						return
					}
					map.relayout()
					map.setBounds(bounds, top, right, bottom, left)
				})

				setMapError(null)
				setMapReady(true)
			})
			.catch((error: unknown) => {
				if (cancelled) {
					return
				}
				setMapError(error instanceof Error ? error.message : '카카오맵을 불러오지 못했습니다.')
			})

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
			mapRef.current = null
			setMapReady(false)
		}
	}, [])

	useEffect(() => {
		if (!mapReady) {
			return
		}

		for (const marker of markersRef.current) {
			const selected = marker.iata === selectedIata
			setAirportMarkerSelected(marker.content, selected)
			marker.overlay.setZIndex(selected ? 10 : 1)
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
