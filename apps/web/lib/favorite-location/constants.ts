const FAVORITE_LOCATIONS_API_BASE_URL = '/api/favorite-locations'

/** 유저당 등록 가능한 관심지역 최대 개수 */
const FAVORITE_LOCATION_MAX_ITEMS = 10

/** 좌표 동일 판별 허용 오차 (약 11m) */
const FAVORITE_LOCATION_COORD_EPSILON = 1e-4

const FAVORITE_LOCATION_TOAST = {
	LOGIN_REQUIRED: '로그인이 필요합니다.',
	ADDED: '관심지역이 추가되었습니다.',
	REMOVED: '관심지역이 해제되었습니다.',
	LIMIT_REACHED: '관심지역은 최대 10개까지 등록할 수 있습니다.'
} as const

export {
	FAVORITE_LOCATION_COORD_EPSILON,
	FAVORITE_LOCATION_MAX_ITEMS,
	FAVORITE_LOCATION_TOAST,
	FAVORITE_LOCATIONS_API_BASE_URL
}
