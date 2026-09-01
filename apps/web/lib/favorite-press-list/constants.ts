const FAVORITE_PRESS_LISTS_API_BASE_URL = '/api/favorite-press-lists'

/** 유저당 등록 가능한 선호목록 최대 개수 */
const FAVORITE_PRESS_LIST_MAX_ITEMS = 5

/** 선호목록당 등록 가능한 언론사 최대 개수 */
const FAVORITE_PRESS_LIST_MAX_PRESSES = 5

/** 선호목록 이름 길이 */
const FAVORITE_PRESS_LIST_NAME_MIN = 2
const FAVORITE_PRESS_LIST_NAME_MAX = 20

const FAVORITE_PRESS_LIST_TOAST = {
	LOGIN_REQUIRED: '로그인이 필요합니다.',
	ADDED: '선호목록이 저장되었습니다.',
	UPDATED: '선호목록이 수정되었습니다.',
	REMOVED: '선호목록이 삭제되었습니다.',
	APPLIED: '선호목록이 적용되었습니다.',
	UNAPPLIED: '선호목록 적용이 해제되었습니다.',
	LIMIT_REACHED: '선호목록은 최대 5개까지 등록할 수 있습니다.',
	DUPLICATE_COMBINATION: '이미 같은 언론사 조합의 선호목록이 있습니다.'
} as const

export {
	FAVORITE_PRESS_LIST_MAX_ITEMS,
	FAVORITE_PRESS_LIST_MAX_PRESSES,
	FAVORITE_PRESS_LIST_NAME_MAX,
	FAVORITE_PRESS_LIST_NAME_MIN,
	FAVORITE_PRESS_LIST_TOAST,
	FAVORITE_PRESS_LISTS_API_BASE_URL
}
