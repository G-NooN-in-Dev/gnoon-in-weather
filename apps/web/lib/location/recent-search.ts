import type { LocationSearchItem } from '@/types/kakao-local.type'

/** localStorage 키 — 최근 검색 목록·저장 on/off */
const RECENT_SEARCH_STORAGE_KEY = 'recent-location-searches'

/** 최근 검색에 남길 최대 개수 */
const RECENT_SEARCH_MAX_ITEMS = 10

/** localStorage에 저장하는 최근 검색 상태 */
type RecentSearchStorage = {
	/** false면 목록을 보여주지 않고 새 선택도 저장하지 않습니다. */
	enabled: boolean
	items: LocationSearchItem[]
}

const DEFAULT_RECENT_SEARCH_STORAGE: RecentSearchStorage = {
	enabled: true,
	items: []
}

/** 외부 JSON이 LocationSearchItem 형태인지 검사합니다. */
function isLocationSearchItem(value: unknown): value is LocationSearchItem {
	if (!value || typeof value !== 'object') {
		return false
	}

	const { id, label, address, lat, lng } = value as Record<string, unknown>

	return (
		typeof id === 'string' &&
		typeof label === 'string' &&
		typeof address === 'string' &&
		Number.isFinite(lat) &&
		Number.isFinite(lng)
	)
}

/** localStorage raw JSON을 안전하게 RecentSearchStorage로 변환합니다. */
function parseRecentSearchStorage(value: string): RecentSearchStorage {
	try {
		const parsed = JSON.parse(value) as Partial<RecentSearchStorage>
		const items = Array.isArray(parsed.items)
			? parsed.items.filter(isLocationSearchItem).slice(0, RECENT_SEARCH_MAX_ITEMS)
			: []

		return {
			enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : true,
			items
		}
	} catch {
		return { ...DEFAULT_RECENT_SEARCH_STORAGE, items: [] }
	}
}

/**
 * 같은 id가 있으면 제거하고 맨 앞에 넣습니다.
 * 최대 개수를 넘으면 오래된 항목부터 잘라냅니다.
 */
function prependRecentSearchItem(items: LocationSearchItem[], item: LocationSearchItem): LocationSearchItem[] {
	const { id } = item
	const withoutDuplicate = items.filter((prev) => prev.id !== id)
	return [item, ...withoutDuplicate].slice(0, RECENT_SEARCH_MAX_ITEMS)
}

export {
	DEFAULT_RECENT_SEARCH_STORAGE,
	parseRecentSearchStorage,
	prependRecentSearchItem,
	RECENT_SEARCH_MAX_ITEMS,
	RECENT_SEARCH_STORAGE_KEY
}
export type { RecentSearchStorage }
