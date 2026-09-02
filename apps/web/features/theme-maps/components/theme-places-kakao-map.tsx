'use client'

import { cn } from '@shared/ui/utils'
import { useEffect, useRef, useState } from 'react'

import {
	createPlacesLatLngBounds,
	getThemeMapMarkerZIndex,
	setBoundsThenShiftSouth,
	THEME_MAP_MAINLAND_BOUNDS_PADDING,
	type ThemeMapBoundsPadding,
	type ThemeMapPlace
} from '@/features/theme-maps/lib/theme-map-place'
import { loadKakaoMapsSdk } from '@/lib/kakao/load-kakao-maps-sdk'

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type ThemePlaceSelectHandler = (id: string) => void
type ThemePlaceHoverChangeHandler = (hovered: boolean) => void
type ThemePlaceVisiblePredicate<TPlace extends ThemeMapPlace> = (place: TPlace) => boolean
type ThemePlaceMarkerContentFactory<TPlace extends ThemeMapPlace> = (
	place: TPlace,
	onSelect: ThemePlaceSelectHandler,
	onHoverChange?: ThemePlaceHoverChangeHandler
) => HTMLElement
type ThemePlaceMarkerSelectedHandler = (content: HTMLElement, selected: boolean) => void
/* eslint-enable no-unused-vars */

type ThemePlacesKakaoMapProps<TPlace extends ThemeMapPlace> = {
	places: readonly TPlace[]
	boundsPlaces: readonly TPlace[]
	boundsPadding?: ThemeMapBoundsPadding
	/** bounds 계산 기준이 바뀌면 지도를 다시 만듭니다. */
	boundsKey?: string
	/** 양수면 setBounds 이후 중심만 남쪽으로 옮깁니다. 줌은 유지합니다. */
	southOffsetDeg?: number
	selectedId: string | null
	onSelect: ThemePlaceSelectHandler
	onClear?: () => void
	isPlaceVisible?: ThemePlaceVisiblePredicate<TPlace>
	/** 마커 표시 여부만 다시 계산할 때 씁니다. 줌은 유지합니다. */
	visibilityKey?: string | boolean
	createMarkerContent: ThemePlaceMarkerContentFactory<TPlace>
	setMarkerSelected: ThemePlaceMarkerSelectedHandler
	/** false면 스크롤·더블클릭·핀치 줌을 막고 초기 bounds 줌을 유지합니다. */
	zoomable?: boolean
	className?: string
	mapClassName?: string
}

type MarkerEntry<TPlace extends ThemeMapPlace> = {
	place: TPlace
	overlay: kakao.maps.CustomOverlay
	content: HTMLElement
}

function attachThemePlaceMarkerContent<TPlace extends ThemeMapPlace>({
	place,
	overlayHolder,
	createMarkerContent,
	onSelect,
	selectedIdRef,
	hoveredIdRef
}: {
	place: TPlace
	overlayHolder: { overlay: kakao.maps.CustomOverlay | null }
	createMarkerContent: ThemePlaceMarkerContentFactory<TPlace>
	onSelect: ThemePlaceSelectHandler
	selectedIdRef: { current: string | null }
	hoveredIdRef: { current: string | null }
}): HTMLElement {
	const { id } = place

	return createMarkerContent(place, onSelect, (hovered) => {
		const overlay = overlayHolder.overlay
		if (!overlay) {
			return
		}

		hoveredIdRef.current = hovered ? id : hoveredIdRef.current === id ? null : hoveredIdRef.current
		overlay.setZIndex(getThemeMapMarkerZIndex(place, selectedIdRef.current, hoveredIdRef.current))
	})
}

/**
 * 카카오맵 + CustomOverlay 마커 공통 지도.
 * 공항·야구장처럼 장소 목록을 올려 선택하는 테마지도에서 재사용합니다.
 */
function ThemePlacesKakaoMap<TPlace extends ThemeMapPlace>({
	places,
	boundsPlaces,
	boundsPadding = THEME_MAP_MAINLAND_BOUNDS_PADDING,
	boundsKey,
	southOffsetDeg = 0,
	selectedId,
	onSelect,
	onClear,
	isPlaceVisible,
	visibilityKey,
	createMarkerContent,
	setMarkerSelected,
	zoomable = true,
	className,
	mapClassName
}: ThemePlacesKakaoMapProps<TPlace>) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<kakao.maps.Map | null>(null)
	const markersRef = useRef<MarkerEntry<TPlace>[]>([])
	const onSelectRef = useRef(onSelect)
	const onClearRef = useRef(onClear)
	const selectedIdRef = useRef(selectedId)
	const hoveredIdRef = useRef<string | null>(null)
	const isPlaceVisibleRef = useRef(isPlaceVisible)
	const createMarkerContentRef = useRef(createMarkerContent)
	const setMarkerSelectedRef = useRef(setMarkerSelected)
	const placesRef = useRef(places)
	const boundsPlacesRef = useRef(boundsPlaces)
	const boundsPaddingRef = useRef(boundsPadding)
	const southOffsetDegRef = useRef(southOffsetDeg)

	const [mapError, setMapError] = useState<string | null>(null)
	const [mapReady, setMapReady] = useState(false)

	useEffect(() => {
		onSelectRef.current = onSelect
		onClearRef.current = onClear
		selectedIdRef.current = selectedId
		isPlaceVisibleRef.current = isPlaceVisible
		createMarkerContentRef.current = createMarkerContent
		setMarkerSelectedRef.current = setMarkerSelected
		placesRef.current = places
		boundsPlacesRef.current = boundsPlaces
		boundsPaddingRef.current = boundsPadding
		southOffsetDegRef.current = southOffsetDeg
	}, [
		onSelect,
		onClear,
		selectedId,
		isPlaceVisible,
		createMarkerContent,
		setMarkerSelected,
		places,
		boundsPlaces,
		boundsPadding,
		southOffsetDeg
	])

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
				const padding = boundsPaddingRef.current
				const bounds = createPlacesLatLngBounds(maps, boundsPlacesRef.current)
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
					scrollwheel: zoomable,
					disableDoubleClickZoom: !zoomable,
					keyboardShortcuts: true
				})

				setBoundsThenShiftSouth(maps, map, bounds, padding, southOffsetDegRef.current)
				if (!zoomable) {
					map.setZoomable(false)
				}
				mapRef.current = map

				const markers: MarkerEntry<TPlace>[] = placesRef.current.map((place) => {
					const overlayHolder: { overlay: kakao.maps.CustomOverlay | null } = { overlay: null }
					const { lat, lng } = place

					const content = attachThemePlaceMarkerContent({
						place,
						overlayHolder,
						createMarkerContent: createMarkerContentRef.current,
						onSelect: (selectedPlaceId) => {
							onSelectRef.current(selectedPlaceId)
						},
						selectedIdRef,
						hoveredIdRef
					})

					const visible = isPlaceVisibleRef.current?.(place) ?? true

					const overlay = new CustomOverlay({
						map: visible ? map : null,
						clickable: true,
						content,
						position: new LatLng(lat, lng),
						xAnchor: 0.5,
						yAnchor: 0.5,
						zIndex: getThemeMapMarkerZIndex(place, selectedIdRef.current, hoveredIdRef.current)
					})
					overlayHolder.overlay = overlay

					return { place, overlay, content }
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
					setBoundsThenShiftSouth(maps, map, bounds, padding, southOffsetDegRef.current)
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
			hoveredIdRef.current = null
			mapRef.current = null
			setMapReady(false)
		}
	}, [boundsKey, southOffsetDeg, zoomable])

	useEffect(() => {
		if (!mapReady) {
			return
		}

		const map = mapRef.current
		if (!map) {
			return
		}

		hoveredIdRef.current = null

		const nextMarkers: MarkerEntry<TPlace>[] = []

		for (const marker of markersRef.current) {
			const overlayHolder = { overlay: marker.overlay }
			const content = attachThemePlaceMarkerContent({
				place: marker.place,
				overlayHolder,
				createMarkerContent: createMarkerContentRef.current,
				onSelect: (selectedPlaceId) => {
					onSelectRef.current(selectedPlaceId)
				},
				selectedIdRef,
				hoveredIdRef
			})

			marker.overlay.setContent(content)

			const selected = marker.place.id === selectedIdRef.current
			setMarkerSelectedRef.current(content, selected)

			const visible = isPlaceVisibleRef.current?.(marker.place) ?? true
			marker.overlay.setMap(visible ? map : null)
			marker.overlay.setZIndex(getThemeMapMarkerZIndex(marker.place, selectedIdRef.current, null))

			nextMarkers.push({
				place: marker.place,
				overlay: marker.overlay,
				content
			})
		}

		markersRef.current = nextMarkers
	}, [mapReady, visibilityKey])

	useEffect(() => {
		if (!mapReady) {
			return
		}

		for (const marker of markersRef.current) {
			const selected = marker.place.id === selectedId
			setMarkerSelectedRef.current(marker.content, selected)
			marker.overlay.setZIndex(getThemeMapMarkerZIndex(marker.place, selectedId, hoveredIdRef.current))
		}
	}, [mapReady, selectedId])

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

export default ThemePlacesKakaoMap
