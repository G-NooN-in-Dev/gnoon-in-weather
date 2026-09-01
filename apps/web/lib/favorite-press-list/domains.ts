import type { PressEntry } from '@/lib/naver/broadcast-press-list'
import { pressList } from '@/lib/naver/broadcast-press-list'

/** 필터 UI에서 허용하는 언론사 domain 집합 */
const VALID_PRESS_DOMAINS = new Set<string>()

for (const entry of pressList) {
	for (const [domain, name] of Object.entries(entry)) {
		if (typeof name === 'string') {
			VALID_PRESS_DOMAINS.add(domain)
		}
	}
}

/** domain이 허용 목록에 있는지 검사합니다. */
function isValidPressDomain(domain: string): boolean {
	return VALID_PRESS_DOMAINS.has(domain)
}

/** domain 배열을 중복 없이 정렬해 비교용 키로 만듭니다. */
function normalizePressDomains(domains: readonly string[]): string[] {
	return [...new Set(domains)].sort()
}

/** 두 domain 배열이 동일한지(순서 무관) 검사합니다. */
function arePressDomainsEqual(left: readonly string[], right: readonly string[]): boolean {
	const normalizedLeft = normalizePressDomains(left)
	const normalizedRight = normalizePressDomains(right)

	if (normalizedLeft.length !== normalizedRight.length) {
		return false
	}

	return normalizedLeft.every((domain, index) => domain === normalizedRight[index])
}

/** domain 배열을 UI용 PressEntry 목록으로 변환합니다. */
function resolvePressEntries(domains: readonly string[]): PressEntry[] {
	const domainNameMap = new Map<string, string>()

	for (const entry of pressList) {
		for (const [domain, name] of Object.entries(entry)) {
			if (typeof name === 'string') {
				domainNameMap.set(domain, name)
			}
		}
	}

	return domains.map((domain) => ({ domain, name: domainNameMap.get(domain) ?? domain }))
}

export { arePressDomainsEqual, isValidPressDomain, normalizePressDomains, resolvePressEntries, VALID_PRESS_DOMAINS }
