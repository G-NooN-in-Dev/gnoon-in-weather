import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/session.server'
import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { invalidateFavoritePressListsCache } from '@/lib/favorite-press-list/cache.server'
import { createFavoritePressListError, isFavoritePressListApiError } from '@/lib/favorite-press-list/errors'
import {
	createFavoritePressListSchema,
	deleteFavoritePressListQuerySchema,
	updateFavoritePressListSchema
} from '@/lib/favorite-press-list/schemas'
import {
	addFavoritePressList,
	listFavoritePressLists,
	removeFavoritePressList,
	updateFavoritePressList
} from '@/services/favorite-press-list.service'
import type {
	FavoritePressListCreateResponse,
	FavoritePressListDeleteResponse,
	FavoritePressListErrorResponse,
	FavoritePressListsListResponse,
	FavoritePressListUpdateResponse
} from '@/types/favorite-press-list.type'

async function GET() {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 401 })
		}

		const items = await listFavoritePressLists(currentUser.id)

		return NextResponse.json({ items } satisfies FavoritePressListsListResponse)
	} catch {
		const error = createFavoritePressListError({
			key: 'FAVORITE_PRESS_INTERNAL_ERROR',
			message: '선호목록을 불러오는 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 500 })
	}
}

async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 401 })
		}

		const body: unknown = await request.json()
		const parsed = createFavoritePressListSchema.safeParse(body)

		if (!parsed.success) {
			const fieldErrors = fieldErrorsFromZod(parsed.error)
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_VALIDATION_ERROR',
				message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.',
				status: 400
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 400 })
		}

		const item = await addFavoritePressList(currentUser.id, parsed.data)

		invalidateFavoritePressListsCache(currentUser.id)

		return NextResponse.json({ item } satisfies FavoritePressListCreateResponse)
	} catch (caught) {
		if (isFavoritePressListApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies FavoritePressListErrorResponse, { status: caught.status })
		}

		const error = createFavoritePressListError({
			key: 'FAVORITE_PRESS_INTERNAL_ERROR',
			message: '선호목록 저장 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 500 })
	}
}

async function PATCH(request: Request) {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 401 })
		}

		const body: unknown = await request.json()
		const parsed = updateFavoritePressListSchema.safeParse(body)

		if (!parsed.success) {
			const fieldErrors = fieldErrorsFromZod(parsed.error)
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_VALIDATION_ERROR',
				message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.',
				status: 400
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 400 })
		}

		const item = await updateFavoritePressList(currentUser.id, parsed.data)

		invalidateFavoritePressListsCache(currentUser.id)

		return NextResponse.json({ item } satisfies FavoritePressListUpdateResponse)
	} catch (caught) {
		if (isFavoritePressListApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies FavoritePressListErrorResponse, { status: caught.status })
		}

		const error = createFavoritePressListError({
			key: 'FAVORITE_PRESS_INTERNAL_ERROR',
			message: '선호목록 수정 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 500 })
	}
}

async function DELETE(request: Request) {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const parsed = deleteFavoritePressListQuerySchema.safeParse({ id: searchParams.get('id') ?? '' })

		if (!parsed.success) {
			const fieldErrors = fieldErrorsFromZod(parsed.error)
			const error = createFavoritePressListError({
				key: 'FAVORITE_PRESS_VALIDATION_ERROR',
				message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.',
				status: 400
			})

			return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 400 })
		}

		await removeFavoritePressList(currentUser.id, parsed.data.id)

		invalidateFavoritePressListsCache(currentUser.id)

		return NextResponse.json({ ok: true } satisfies FavoritePressListDeleteResponse)
	} catch (caught) {
		if (isFavoritePressListApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies FavoritePressListErrorResponse, { status: caught.status })
		}

		const error = createFavoritePressListError({
			key: 'FAVORITE_PRESS_INTERNAL_ERROR',
			message: '선호목록 삭제 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies FavoritePressListErrorResponse, { status: 500 })
	}
}

export { DELETE, GET, PATCH, POST }
