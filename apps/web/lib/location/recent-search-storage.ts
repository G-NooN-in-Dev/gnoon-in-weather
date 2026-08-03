import {
	DEFAULT_RECENT_SEARCH_STORAGE,
	parseRecentSearchStorage,
	RECENT_SEARCH_STORAGE_KEY,
	type RecentSearchStorage
} from '@/lib/location/recent-search'

/** 브라우저 localStorage에서 최근 검색 상태를 읽습니다. */
function readRecentSearchStorage(): RecentSearchStorage {
	if (typeof window === 'undefined') {
		return { ...DEFAULT_RECENT_SEARCH_STORAGE, items: [] }
	}

	try {
		const raw = window.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY)
		if (!raw) {
			return { ...DEFAULT_RECENT_SEARCH_STORAGE, items: [] }
		}
		return parseRecentSearchStorage(raw)
	} catch {
		// private mode 등으로 localStorage가 막힌 경우 기본값
		return { ...DEFAULT_RECENT_SEARCH_STORAGE, items: [] }
	}
}

/** 최근 검색 상태를 localStorage에 저장합니다. */
function writeRecentSearchStorage(next: RecentSearchStorage): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		window.localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(next))
	} catch {
		// quota·private mode 등은 무시 — UI 상태는 메모리에만 남을 수 있음
	}
}

export { readRecentSearchStorage, writeRecentSearchStorage }
