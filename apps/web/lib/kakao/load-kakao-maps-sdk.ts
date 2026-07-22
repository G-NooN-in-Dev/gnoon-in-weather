/**
 * 카카오맵 JavaScript SDK를 한 번만 로드합니다.
 * REST API 키가 아니라 NEXT_PUBLIC_KAKAO_JS_KEY(JavaScript 키)가 필요합니다.
 * 카카오디벨로퍼스에 JavaScript 키 도메인(예: http://localhost:3000) 등록이 필요합니다.
 */

const KAKAO_MAPS_SDK_ID = 'kakao-maps-sdk'

type KakaoMapsSdkStatus = 'idle' | 'loading' | 'ready' | 'error'

let loadPromise: Promise<typeof kakao> | null = null

function getKakaoJsKey() {
	const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim()
	if (!key) {
		throw new Error('NEXT_PUBLIC_KAKAO_JS_KEY가 없습니다. .env에 JavaScript 키를 넣고 dev 서버를 재시작해 주세요.')
	}
	return key
}

function readSdkStatus(): KakaoMapsSdkStatus {
	if (typeof window === 'undefined') {
		return 'idle'
	}
	if (window.kakao?.maps) {
		return 'ready'
	}
	return 'idle'
}

/** 실패한 스크립트 태그를 제거해 재시도 가능하게 합니다. */
function removeStaleSdkScript() {
	const existing = document.getElementById(KAKAO_MAPS_SDK_ID)
	if (existing && !window.kakao?.maps) {
		existing.remove()
	}
}

/**
 * 카카오맵 SDK 스크립트를 주입하고 `kakao.maps` 사용 가능 상태가 되면 resolve합니다.
 */
function loadKakaoMapsSdk(): Promise<typeof kakao> {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('카카오맵 SDK는 브라우저에서만 로드할 수 있습니다.'))
	}

	if (window.kakao?.maps) {
		return Promise.resolve(window.kakao)
	}

	if (loadPromise) {
		return loadPromise
	}

	loadPromise = new Promise((resolve, reject) => {
		const fail = (message: string) => {
			removeStaleSdkScript()
			loadPromise = null
			reject(new Error(message))
		}

		const finish = () => {
			if (!window.kakao?.maps) {
				fail('카카오맵 SDK를 초기화하지 못했습니다. JavaScript 키와 사이트 도메인 등록을 확인해 주세요.')
				return
			}
			window.kakao.maps.load(() => {
				resolve(window.kakao)
			})
		}

		removeStaleSdkScript()

		const script = document.createElement('script')
		script.id = KAKAO_MAPS_SDK_ID
		script.async = true
		// autoload=false 후 maps.load 콜백에서 초기화합니다.
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(getKakaoJsKey())}&autoload=false`
		script.addEventListener('load', finish, { once: true })
		script.addEventListener(
			'error',
			() => {
				fail('카카오맵 SDK 스크립트 로드에 실패했습니다. JavaScript 키·도메인 등록·서버 재시작을 확인해 주세요.')
			},
			{ once: true }
		)
		document.head.appendChild(script)
	})

	return loadPromise
}

export { loadKakaoMapsSdk, readSdkStatus }
