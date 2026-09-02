'use client'

import { toast } from '@shared/ui/sonner'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import {
	requestAddFavoriteLocation,
	requestFavoriteLocations,
	requestRemoveFavoriteLocation
} from '@/lib/favorite-location/client'
import { FAVORITE_LOCATION_MAX_ITEMS, FAVORITE_LOCATION_TOAST } from '@/lib/favorite-location/constants'
import { isSameFavoriteLocation } from '@/lib/favorite-location/match'
import type { FavoriteLocation } from '@/types/favorite-location.type'
import type { LocationState } from '@/types/location.type'

type UseFavoriteLocationsOptions = {
	initialItems: FavoriteLocation[]
	isLoggedIn: boolean
}

type UseFavoriteLocationsResult = {
	items: FavoriteLocation[]
	isFavorite: (location: LocationState) => boolean
	isPending: boolean
	removeById: (id: string) => Promise<boolean>
	toggleFavorite: (location: LocationState) => Promise<void>
}

/**
 * 관심지역 목록·Star 토글을 관리합니다.
 * 성공·비로그인·오류 토스트는 이 훅에서 처리합니다.
 */
function useFavoriteLocations({ initialItems, isLoggedIn }: UseFavoriteLocationsOptions): UseFavoriteLocationsResult {
	const router = useRouter()
	const [items, setItems] = useState(initialItems)
	const [isPending, setIsPending] = useState(false)
	const [prevIsLoggedIn, setPrevIsLoggedIn] = useState(isLoggedIn)

	// 로그아웃 시 목록 비우기
	if (prevIsLoggedIn !== isLoggedIn) {
		setPrevIsLoggedIn(isLoggedIn)
		if (!isLoggedIn) {
			setItems([])
		}
	}

	useEffect(() => {
		if (!isLoggedIn) {
			return
		}

		let cancelled = false

		async function syncItems() {
			const nextItems = await requestFavoriteLocations()

			if (!cancelled) {
				setItems(nextItems)
			}
		}

		void syncItems()

		return () => {
			cancelled = true
		}
	}, [isLoggedIn])

	const isFavorite = useCallback(
		(location: LocationState) =>
			items.some((item) =>
				isSameFavoriteLocation(item, {
					placeId: location.placeId,
					lat: location.lat,
					lng: location.lng
				})
			),
		[items]
	)

	const removeById = useCallback(
		async (id: string) => {
			setIsPending(true)

			try {
				const result = await requestRemoveFavoriteLocation(id)

				if (!result.ok) {
					toast.error(result.message)
					return false
				}

				setItems((current) => current.filter((item) => item.id !== id))
				router.refresh()
				toast.success(FAVORITE_LOCATION_TOAST.REMOVED)
				return true
			} finally {
				setIsPending(false)
			}
		},
		[router]
	)

	const toggleFavorite = useCallback(
		async (location: LocationState) => {
			if (!isLoggedIn) {
				toast.error(FAVORITE_LOCATION_TOAST.LOGIN_REQUIRED)
				return
			}

			if (!location.label.trim()) {
				return
			}

			const existing = items.find((item) =>
				isSameFavoriteLocation(item, {
					placeId: location.placeId,
					lat: location.lat,
					lng: location.lng
				})
			)

			setIsPending(true)

			try {
				if (existing) {
					const result = await requestRemoveFavoriteLocation(existing.id)

					if (!result.ok) {
						toast.error(result.message)
						return
					}

					setItems((current) => current.filter((item) => item.id !== existing.id))
					router.refresh()
					toast.success(FAVORITE_LOCATION_TOAST.REMOVED)
					return
				}

				const result = await requestAddFavoriteLocation({
					placeId: location.placeId ?? null,
					label: location.label,
					address: location.address ?? '',
					lat: location.lat,
					lng: location.lng
				})

				if (!result.ok) {
					toast.error(result.message)
					return
				}

				setItems((current) => [...current, result.item].slice(0, FAVORITE_LOCATION_MAX_ITEMS))
				router.refresh()
				toast.success(FAVORITE_LOCATION_TOAST.ADDED)
			} finally {
				setIsPending(false)
			}
		},
		[isLoggedIn, items, router]
	)

	return { items, isFavorite, isPending, removeById, toggleFavorite }
}

export default useFavoriteLocations
export type { UseFavoriteLocationsOptions, UseFavoriteLocationsResult }
