import { NextRequest, NextResponse } from 'next/server'

import { isAppApiError } from '@/lib/api-error'
import { KAKAO_INVALID_QUERY_ERROR } from '@/lib/kakao/api-route-errors'
import { parseKakaoSearchQuery } from '@/lib/kakao/parse-api-query'
import { loadLocationSearchResults } from '@/services/kakao.loader'
import type { AppApiError } from '@/types/error.type'
import type { LocationSearchResponse } from '@/types/kakao-local.type'

/** 장소·주소 검색 프록시. REST 키는 서버에서만 사용합니다. */
async function GET(request: NextRequest) {
	const query = parseKakaoSearchQuery(request.nextUrl.searchParams)

	if (!query) {
		return NextResponse.json({ error: KAKAO_INVALID_QUERY_ERROR }, { status: 400 })
	}

	try {
		const items = await loadLocationSearchResults(query)
		const body = { items } satisfies LocationSearchResponse

		return NextResponse.json(body)
	} catch (error) {
		if (isAppApiError(error)) {
			return NextResponse.json({ error }, { status: error.status })
		}

		const internalError: AppApiError = {
			provider: 'kakao',
			code: 0,
			key: 'KAKAO_INTERNAL_ERROR',
			status: 500,
			retryable: true,
			message: error instanceof Error ? error.message : '위치 검색 중 오류가 발생했습니다.'
		}

		return NextResponse.json({ error: internalError }, { status: 500 })
	}
}

export { GET }
