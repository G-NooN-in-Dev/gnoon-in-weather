import { z } from 'zod'

const addFavoriteLocationSchema = z.object({
	placeId: z.string().nullable(),
	label: z.string().trim().min(1, { error: '주소/장소 정보를 확인해 주세요.' }),
	address: z.string(),
	lat: z.number().finite(),
	lng: z.number().finite()
})

const deleteFavoriteLocationQuerySchema = z.object({
	id: z.string().trim().min(1, { error: '해당 관심지역을 찾지 못했습니다.' })
})

type AddFavoriteLocationInput = z.infer<typeof addFavoriteLocationSchema>

export { addFavoriteLocationSchema, deleteFavoriteLocationQuerySchema }
export type { AddFavoriteLocationInput }
