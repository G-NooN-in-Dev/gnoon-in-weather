import { z } from 'zod'

import {
	FAVORITE_PRESS_LIST_MAX_PRESSES,
	FAVORITE_PRESS_LIST_NAME_MAX,
	FAVORITE_PRESS_LIST_NAME_MIN
} from '@/lib/favorite-press-list/constants'
import { isValidPressDomain } from '@/lib/favorite-press-list/domains'

const favoritePressListNameSchema = z
	.string()
	.trim()
	.min(1, { error: '목록 이름을 입력해 주세요.' })
	.min(FAVORITE_PRESS_LIST_NAME_MIN, {
		error: `목록 이름은 ${FAVORITE_PRESS_LIST_NAME_MIN}~${FAVORITE_PRESS_LIST_NAME_MAX}자입니다.`
	})
	.max(FAVORITE_PRESS_LIST_NAME_MAX, {
		error: `목록 이름은 ${FAVORITE_PRESS_LIST_NAME_MIN}~${FAVORITE_PRESS_LIST_NAME_MAX}자입니다.`
	})

const favoritePressListDomainsSchema = z
	.array(z.string().trim().min(1))
	.min(1, { error: '언론사를 1개 이상 선택해 주세요.' })
	.max(FAVORITE_PRESS_LIST_MAX_PRESSES, {
		error: `언론사는 최대 ${FAVORITE_PRESS_LIST_MAX_PRESSES}개까지 선택할 수 있습니다.`
	})
	.refine((domains) => new Set(domains).size === domains.length, {
		error: '중복된 언론사는 선택할 수 없습니다.'
	})
	.refine((domains) => domains.every(isValidPressDomain), {
		error: '허용되지 않은 언론사가 포함되어 있습니다.'
	})

const createFavoritePressListSchema = z.object({
	name: favoritePressListNameSchema,
	domains: favoritePressListDomainsSchema
})

const updateFavoritePressListSchema = z.object({
	id: z.string().trim().min(1, { error: '선호목록을 찾지 못했습니다.' }),
	domains: favoritePressListDomainsSchema
})

const deleteFavoritePressListQuerySchema = z.object({
	id: z.string().trim().min(1, { error: '선호목록을 찾지 못했습니다.' })
})

type CreateFavoritePressListInput = z.infer<typeof createFavoritePressListSchema>
type UpdateFavoritePressListInput = z.infer<typeof updateFavoritePressListSchema>

export { createFavoritePressListSchema, deleteFavoritePressListQuerySchema, updateFavoritePressListSchema }
export type { CreateFavoritePressListInput, UpdateFavoritePressListInput }
