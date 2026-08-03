import { NextRequest, NextResponse } from 'next/server'

import { isAppApiError } from '@/lib/api-error'
import { KAKAO_INVALID_COORDINATES_ERROR } from '@/lib/kakao/api-route-errors'
import { parseKakaoCoordQuery } from '@/lib/kakao/parse-api-query'
import { loadCoordAddressLabel } from '@/services/kakao.loader'
import type { AppApiError } from '@/types/error.type'
import type { CoordAddressLabelResponse } from '@/types/kakao-local.type'

/** 좌표 → 도로명/지번 라벨 프록시. GPS 직후 CurrentLocation 표시에 사용합니다. */
async function GET(request: NextRequest) {
	const coordinates = parseKakaoCoordQuery(request.nextUrl.searchParams)

	if (!coordinates) {
		return NextResponse.json({ error: KAKAO_INVALID_COORDINATES_ERROR }, { status: 400 })
	}

	try {
		const body = (await loadCoordAddressLabel(coordinates)) satisfies CoordAddressLabelResponse

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
			message: error instanceof Error ? error.message : '주소 정보를 불러오는 중 오류가 발생했습니다.'
		}

		return NextResponse.json({ error: internalError }, { status: 500 })
	}
}

export { GET }
