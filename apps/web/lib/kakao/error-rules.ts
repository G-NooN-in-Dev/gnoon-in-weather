import type { AppApiErrorRule } from '@/types/error.type'

/**
 * Kakao Local REST API 공식 에러 코드 목록을 매핑합니다.
 * 참고: https://developers.kakao.com/docs/ko/rest-api/error-code#common
 */
const KAKAO_COMMON_ERROR_RULES: Record<number | string, AppApiErrorRule> = {
	'-1': {
		key: 'KAKAO_INTERNAL_ERROR',
		status: 500,
		retryable: true,
		message: '카카오 API 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
	},
	'-2': {
		key: 'KAKAO_INVALID_PARAMETER',
		status: 400,
		retryable: false,
		message: '카카오 API 요청 파라미터를 확인해주세요.'
	},
	'-3': {
		key: 'KAKAO_REQUIRED_SETTING_MISSING',
		status: 403,
		retryable: false,
		message: '카카오 개발자 설정에서 필요한 기능 활성화 또는 호출 허용 설정이 필요합니다.'
	},
	'-4': {
		key: 'KAKAO_ACCOUNT_RESTRICTED',
		status: 403,
		retryable: false,
		message: '카카오 API 접근이 거부되었습니다. 제재된 계정 또는 제재 대상 동작입니다.'
	},
	'-5': {
		key: 'KAKAO_PERMISSION_DENIED',
		status: 403,
		retryable: false,
		message: '해당 카카오 API 사용 권한이 없습니다.'
	},
	'-6': {
		key: 'KAKAO_ACTION_NOT_ALLOWED',
		status: 403,
		retryable: false,
		message: '카카오 API 요청이 거부되었습니다. 카카오 서비스에서 허용하지 않는 동작입니다.'
	},
	'-7': {
		key: 'KAKAO_SERVICE_ISSUE',
		status: 503,
		retryable: true,
		message: '카카오 API 서비스 점검 또는 내부 문제로 요청을 처리할 수 없습니다.'
	},
	'-8': {
		key: 'KAKAO_INVALID_HEADER',
		status: 400,
		retryable: false,
		message: '카카오 API 요청 헤더를 확인해주세요.'
	},
	'-9': {
		key: 'KAKAO_API_TERMINATED',
		status: 400,
		retryable: false,
		message: '요청하신 카카오 API의 서비스가 종료되었습니다. 공지사항을 확인해주세요.'
	},
	'-10': {
		key: 'KAKAO_QUOTA_EXCEEDED',
		status: 400,
		retryable: true,
		message: '카카오 API 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
	},
	'-11': {
		key: 'KAKAO_BILLING_LIMIT_EXCEEDED',
		status: 400,
		retryable: false,
		message: '카카오 API 유료 한도 금액을 초과했습니다. 요금제 또는 사용량을 확인해주세요.'
	},
	'-12': {
		key: 'KAKAO_APP_OR_ACCOUNT_RESTRICTED',
		status: 403,
		retryable: false,
		message: '카카오디벨로퍼스 앱 또는 개발자 계정이 제재 상태입니다.'
	},
	'-13': {
		key: 'KAKAO_APP_DORMANT_STATE',
		status: 400,
		retryable: false,
		message: '장기 미이용 상태의 카카오디벨로퍼스 앱입니다. 카카오디벨로퍼스 앱 관리 페이지에서 해제해주세요.'
	},
	'-401': {
		key: 'KAKAO_UNAUTHORIZED',
		status: 401,
		retryable: false,
		message: '카카오 API 인증 정보가 올바르지 않습니다.'
	},
	'-603': {
		key: 'KAKAO_PLATFORM_TIMEOUT',
		status: 504,
		retryable: true,
		message: '카카오 플랫폼 내부 요청 타임아웃이 발생했습니다. 잠시 후 다시 시도해주세요.'
	},
	'-903': {
		key: 'KAKAO_UNREGISTERED_DEVELOPER_KEY',
		status: 400,
		retryable: false,
		message: '등록되지 않은 개발자의 앱키 또는 토큰입니다. 카카오디벨로퍼스 개발자 설정을 확인해주세요.'
	},
	'-9798': {
		key: 'KAKAO_MAINTENANCE',
		status: 503,
		retryable: true,
		message: '카카오 서비스 점검 중입니다. 잠시 후 다시 시도해주세요.'
	}
}

export { KAKAO_COMMON_ERROR_RULES }
