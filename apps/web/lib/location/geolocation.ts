import type { AppApiError } from '@/types/error.type'

/** getCurrentPosition 기본 옵션 — Mac Wi-Fi 측위 여유 + 최근 캐시 허용 */
const DEFAULT_GEOLOCATION_OPTIONS: PositionOptions = {
	enableHighAccuracy: false,
	timeout: 15_000,
	maximumAge: 60_000
}

/** POSITION_UNAVAILABLE 재시도 전 대기(ms) */
const POSITION_UNAVAILABLE_RETRY_DELAY_MS = 800

/** 현재 위치 요청 성공·실패를 한 타입으로 묶습니다. */
type GeolocationResult = { ok: true; position: GeolocationPosition } | { ok: false; error: AppApiError }

/**
 * navigator.geolocation.getCurrentPosition을 Promise로 감쌉니다.
 * 성공·실패를 async/await로 다루기 위한 얇은 래퍼입니다.
 */
function getCurrentPositionOnce(options: PositionOptions = DEFAULT_GEOLOCATION_OPTIONS): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, options)
	})
}

/**
 * getCurrentPosition reject 값이 GeolocationPositionError인지 좁힙니다.
 * Promise 래퍼가 unknown을 넘길 수 있어 런타임 형태를 확인합니다.
 */
function isGeolocationPositionError(error: unknown): error is GeolocationPositionError {
	return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'number'
}

/**
 * 브라우저 GeolocationPositionError → AppApiError로 변환합니다.
 * CoreLocation의 LocationUnknown은 보통 POSITION_UNAVAILABLE(code 2)로 옵니다.
 */
function toGeolocationError(error: GeolocationPositionError): AppApiError {
	const { code, PERMISSION_DENIED, TIMEOUT } = error

	if (code === PERMISSION_DENIED) {
		return {
			provider: 'weatherapi',
			code: 0,
			key: 'GEOLOCATION_DENIED',
			status: 400,
			retryable: false,
			message: '현재 위치 권한이 필요합니다. 브라우저 설정을 확인해주세요.'
		}
	}

	if (code === TIMEOUT) {
		return {
			provider: 'weatherapi',
			code: 0,
			key: 'GEOLOCATION_TIMEOUT',
			status: 400,
			retryable: true,
			message: '위치 확인 시간이 초과되었습니다. 다시 시도해주세요.'
		}
	}

	// POSITION_UNAVAILABLE — OS가 좌표 fix를 못 한 경우(Wi-Fi 측위 실패 등)
	return {
		provider: 'weatherapi',
		code: 0,
		key: 'GEOLOCATION_POSITION_UNAVAILABLE',
		status: 400,
		retryable: true,
		message: '현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.'
	}
}

/** 알 수 없는 reject 값용 폴백 에러 */
function createGeolocationUnknownError(): AppApiError {
	return {
		provider: 'weatherapi',
		code: 0,
		key: 'GEOLOCATION_POSITION_UNAVAILABLE',
		status: 400,
		retryable: true,
		message: '현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.'
	}
}

/** reject 값을 AppApiError로 정규화합니다. */
function normalizeGeolocationFailure(error: unknown): AppApiError {
	if (isGeolocationPositionError(error)) {
		return toGeolocationError(error)
	}
	return createGeolocationUnknownError()
}

/** Geolocation API 미지원 브라우저용 에러 */
function createGeolocationUnavailableError(): AppApiError {
	return {
		provider: 'weatherapi',
		code: 0,
		key: 'GEOLOCATION_UNAVAILABLE',
		status: 400,
		retryable: false,
		message: '이 브라우저에서는 현재 위치를 사용할 수 없습니다.'
	}
}

/**
 * 현재 위치를 한 번 요청하고, POSITION_UNAVAILABLE이면 짧게 대기 후 1회 재시도합니다.
 * 권한 거부·타임아웃은 재시도하지 않습니다.
 */
async function requestCurrentGeolocation(
	options: PositionOptions = DEFAULT_GEOLOCATION_OPTIONS
): Promise<GeolocationResult> {
	if (!navigator.geolocation) {
		return { ok: false, error: createGeolocationUnavailableError() }
	}

	try {
		const position = await getCurrentPositionOnce(options)
		return { ok: true, position }
	} catch (error) {
		// 일시적 LocationUnknown만 재시도 — 권한 거부는 의미 없음
		if (!isGeolocationPositionError(error) || error.code !== error.POSITION_UNAVAILABLE) {
			return { ok: false, error: normalizeGeolocationFailure(error) }
		}

		await new Promise((resolve) => setTimeout(resolve, POSITION_UNAVAILABLE_RETRY_DELAY_MS))

		try {
			// 재시도는 캐시 없이 새로 측위
			const position = await getCurrentPositionOnce({ ...options, maximumAge: 0 })
			return { ok: true, position }
		} catch (retryError) {
			return { ok: false, error: normalizeGeolocationFailure(retryError) }
		}
	}
}

export { requestCurrentGeolocation }
export type { GeolocationResult }
