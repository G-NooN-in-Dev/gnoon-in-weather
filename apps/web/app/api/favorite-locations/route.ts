import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/session.server'
import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { invalidateFavoriteLocationsCache } from '@/lib/favorite-location/cache.server'
import { createFavoriteLocationError, isFavoriteLocationApiError } from '@/lib/favorite-location/errors'
import { addFavoriteLocationSchema, deleteFavoriteLocationQuerySchema } from '@/lib/favorite-location/schemas'
import {
	addFavoriteLocation,
	listFavoriteLocations,
	removeFavoriteLocation
} from '@/services/favorite-location.service'
import type {
	FavoriteLocationCreateResponse,
	FavoriteLocationDeleteResponse,
	FavoriteLocationErrorResponse,
	FavoriteLocationsListResponse
} from '@/types/favorite-location.type'

async function GET() {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoriteLocationError({
				key: 'FAVORITE_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 401 })
		}

		const items = await listFavoriteLocations(currentUser.id)

		return NextResponse.json({ items } satisfies FavoriteLocationsListResponse)
	} catch {
		const error = createFavoriteLocationError({
			key: 'FAVORITE_INTERNAL_ERROR',
			message: '관심지역을 불러오는 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 500 })
	}
}

async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoriteLocationError({
				key: 'FAVORITE_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 401 })
		}

		const body: unknown = await request.json()
		const parsed = addFavoriteLocationSchema.safeParse(body)

		if (!parsed.success) {
			const fieldErrors = fieldErrorsFromZod(parsed.error)
			const error = createFavoriteLocationError({
				key: 'FAVORITE_VALIDATION_ERROR',
				message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.',
				status: 400
			})

			return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 400 })
		}

		const item = await addFavoriteLocation(currentUser.id, parsed.data)

		invalidateFavoriteLocationsCache(currentUser.id)

		return NextResponse.json({ item } satisfies FavoriteLocationCreateResponse)
	} catch (caught) {
		if (isFavoriteLocationApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies FavoriteLocationErrorResponse, { status: caught.status })
		}

		const error = createFavoriteLocationError({
			key: 'FAVORITE_INTERNAL_ERROR',
			message: '관심지역 추가 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 500 })
	}
}

async function DELETE(request: Request) {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoriteLocationError({
				key: 'FAVORITE_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const parsed = deleteFavoriteLocationQuerySchema.safeParse({ id: searchParams.get('id') ?? '' })

		if (!parsed.success) {
			const fieldErrors = fieldErrorsFromZod(parsed.error)
			const error = createFavoriteLocationError({
				key: 'FAVORITE_VALIDATION_ERROR',
				message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.',
				status: 400
			})

			return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 400 })
		}

		await removeFavoriteLocation(currentUser.id, parsed.data.id)

		invalidateFavoriteLocationsCache(currentUser.id)

		return NextResponse.json({ ok: true } satisfies FavoriteLocationDeleteResponse)
	} catch (caught) {
		if (isFavoriteLocationApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies FavoriteLocationErrorResponse, { status: caught.status })
		}

		const error = createFavoriteLocationError({
			key: 'FAVORITE_INTERNAL_ERROR',
			message: '관심지역 해제 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoriteLocationErrorResponse, { status: 500 })
	}
}

export { DELETE, GET, POST }
