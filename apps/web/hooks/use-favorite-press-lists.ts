'use client'

import { toast } from '@shared/ui/sonner'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import {
	requestCreateFavoritePressList,
	requestFavoritePressLists,
	requestRemoveFavoritePressList,
	requestUpdateFavoritePressList
} from '@/lib/favorite-press-list/client'
import { FAVORITE_PRESS_LIST_MAX_ITEMS, FAVORITE_PRESS_LIST_TOAST } from '@/lib/favorite-press-list/constants'
import { arePressDomainsEqual } from '@/lib/favorite-press-list/domains'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

type UseFavoritePressListsOptions = {
	initialItems?: FavoritePressList[]
	isLoggedIn: boolean
}

type UseFavoritePressListsResult = {
	items: FavoritePressList[]
	isLoading: boolean
	isPending: boolean
	createList: (input: { name: string; domains: string[] }) => Promise<FavoritePressList | null>
	updateList: (input: { id: string; domains: string[] }) => Promise<FavoritePressList | null>
	removeList: (id: string) => Promise<boolean>
}

/**
 * 언론사 선호목록 CRUD를 관리합니다.
 * 성공·오류 토스트는 이 훅에서 처리합니다.
 */
function useFavoritePressLists({
	initialItems,
	isLoggedIn
}: UseFavoritePressListsOptions): UseFavoritePressListsResult {
	const router = useRouter()
	const hasInitialItems = initialItems !== undefined
	const [items, setItems] = useState(hasInitialItems ? initialItems : [])
	const [isLoading, setIsLoading] = useState(!hasInitialItems)
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
			try {
				const nextItems = await requestFavoritePressLists()

				if (!cancelled) {
					setItems(nextItems)
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false)
				}
			}
		}

		void syncItems()

		return () => {
			cancelled = true
		}
	}, [isLoggedIn])

	const createList = useCallback(
		async ({ name, domains }: { name: string; domains: string[] }) => {
			if (!isLoggedIn) {
				toast.error(FAVORITE_PRESS_LIST_TOAST.LOGIN_REQUIRED)
				return null
			}

			if (items.length >= FAVORITE_PRESS_LIST_MAX_ITEMS) {
				toast.error(FAVORITE_PRESS_LIST_TOAST.LIMIT_REACHED)
				return null
			}

			if (items.some((item) => arePressDomainsEqual(item.domains, domains))) {
				toast.error(FAVORITE_PRESS_LIST_TOAST.DUPLICATE_COMBINATION)
				return null
			}

			setIsPending(true)

			try {
				const result = await requestCreateFavoritePressList({ name, domains })

				if (!result.ok) {
					toast.error(result.message)
					return null
				}

				setItems((current) => [...current, result.item].slice(0, FAVORITE_PRESS_LIST_MAX_ITEMS))
				router.refresh()
				toast.success(FAVORITE_PRESS_LIST_TOAST.ADDED)
				return result.item
			} finally {
				setIsPending(false)
			}
		},
		[isLoggedIn, items, router]
	)

	const updateList = useCallback(
		async ({ id, domains }: { id: string; domains: string[] }) => {
			if (!isLoggedIn) {
				toast.error(FAVORITE_PRESS_LIST_TOAST.LOGIN_REQUIRED)
				return null
			}

			if (items.some((item) => item.id !== id && arePressDomainsEqual(item.domains, domains))) {
				toast.error(FAVORITE_PRESS_LIST_TOAST.DUPLICATE_COMBINATION)
				return null
			}

			setIsPending(true)

			try {
				const result = await requestUpdateFavoritePressList({ id, domains })

				if (!result.ok) {
					toast.error(result.message)
					return null
				}

				setItems((current) => current.map((item) => (item.id === id ? result.item : item)))
				router.refresh()
				toast.success(FAVORITE_PRESS_LIST_TOAST.UPDATED)
				return result.item
			} finally {
				setIsPending(false)
			}
		},
		[isLoggedIn, items, router]
	)

	const removeList = useCallback(
		async (id: string) => {
			if (!isLoggedIn) {
				toast.error(FAVORITE_PRESS_LIST_TOAST.LOGIN_REQUIRED)
				return false
			}

			setIsPending(true)

			try {
				const result = await requestRemoveFavoritePressList(id)

				if (!result.ok) {
					toast.error(result.message)
					return false
				}

				setItems((current) => current.filter((item) => item.id !== id))
				router.refresh()
				toast.success(FAVORITE_PRESS_LIST_TOAST.REMOVED)
				return true
			} finally {
				setIsPending(false)
			}
		},
		[isLoggedIn, router]
	)

	return { items, isLoading, isPending, createList, updateList, removeList }
}

export default useFavoritePressLists
export type { UseFavoritePressListsOptions, UseFavoritePressListsResult }
