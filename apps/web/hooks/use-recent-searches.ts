'use client'

import { useSyncExternalStore } from 'react'

import {
	DEFAULT_RECENT_SEARCH_STORAGE,
	prependRecentSearchItem,
	type RecentSearchStorage
} from '@/lib/location/recent-search'
import { readRecentSearchStorage, writeRecentSearchStorage } from '@/lib/location/recent-search-storage'
import type { LocationSearchItem } from '@/types/kakao-local.type'

/**
 * localStorage 기반 최근 검색 스토어.
 * hydrate 전에는 기본값을 쓰고, 구독이 붙으면 한 번 읽어 맞춥니다.
 * (서버 스냅샷과 첫 클라 스냅샷을 같게 유지해 mismatch를 피합니다.)
 */
let memory: RecentSearchStorage = {
	...DEFAULT_RECENT_SEARCH_STORAGE,
	items: []
}
let hydrated = false
const listeners = new Set<() => void>()

function emit() {
	listeners.forEach((listener) => listener())
}

function setMemory(next: RecentSearchStorage) {
	memory = next
	writeRecentSearchStorage(next)
	emit()
}

function subscribe(listener: () => void) {
	listeners.add(listener)

	// 첫 구독 시 localStorage를 읽고, 렌더 중이 아닐 때 구독자에게 알립니다.
	if (!hydrated && typeof window !== 'undefined') {
		hydrated = true
		memory = readRecentSearchStorage()
		queueMicrotask(() => emit())
	}

	return () => {
		listeners.delete(listener)
	}
}

function getSnapshot() {
	return memory
}

function getServerSnapshot(): RecentSearchStorage {
	return DEFAULT_RECENT_SEARCH_STORAGE
}

/**
 * 최근 검색 목록·저장 on/off를 읽고 갱신합니다.
 * LocationSearch에서 포커스 시 패널·선택 시 저장에 사용합니다.
 */
function useRecentSearches() {
	const { enabled, items } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

	return {
		enabled,
		items,
		setEnabled(nextEnabled: boolean) {
			const current = getSnapshot()
			setMemory({ ...current, enabled: nextEnabled })
		},
		add(item: LocationSearchItem) {
			const current = getSnapshot()
			if (!current.enabled) {
				return
			}
			setMemory({
				...current,
				items: prependRecentSearchItem(current.items, item)
			})
		},
		remove(id: string) {
			const current = getSnapshot()
			setMemory({
				...current,
				items: current.items.filter((item) => item.id !== id)
			})
		},
		clear() {
			const current = getSnapshot()
			setMemory({ ...current, items: [] })
		}
	}
}

export default useRecentSearches
