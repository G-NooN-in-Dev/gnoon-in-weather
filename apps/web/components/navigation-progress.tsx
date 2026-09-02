'use client'

import { cn } from '@shared/ui/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { subscribeNavigationStart } from '@/lib/navigation/navigation-progress-events'

/**
 * 상단 progress bar 상태
 * - idle: 대기 / loading : 로딩 중 / completing : 완료 중
 */
type NavigationProgressState = 'idle' | 'loading' | 'completing'

/**
 * App Router 페이지 이동 시 보여지는 상단 progress bar.
 * Link 클릭·`useAppRouter`의 push/replace를 감지합니다.
 */
function NavigationProgress() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const routeKey = `${pathname}?${searchParams.toString()}`
	const [state, setState] = useState<NavigationProgressState>('idle')
	const [width, setWidth] = useState(0)
	const intervalRef = useRef<number | undefined>(undefined)
	const isFirstRouteRef = useRef(true)

	/** 로딩 시작 & 상단 progress bar 너비를 10%로 설정합니다. */
	const startLoading = () => {
		setState('loading')
		setWidth(10)
	}

	/** 페이지 이동 시작 이벤트를 구독합니다. */
	useEffect(() => subscribeNavigationStart(startLoading), [])

	useEffect(() => {
		// 클릭 이벤트 처리
		const handleClick = (event: MouseEvent) => {
			// 다른 핸들러가 클릭을 취소한 경우 처리하지 않습니다.
			if (event.defaultPrevented) {
				return
			}

			// 새 탭 or 다른 동작 (Cmd/Ctrl/Shift/Alt) 이 발생했거나 좌클릭이 아닌 경우(event.button !== 0) 처리하지 않습니다.
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
				return
			}

			// 링크가 아니거나, 새 탭 or 다운로드 속성이 있으면 처리하지 않습니다.
			const anchor = (event.target as Element | null)?.closest('a')
			if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
				return
			}

			// 앵커 요소의 href 속성을 URL로 변환할 수 없으면 처리하지 않습니다.
			const href = anchor.getAttribute('href')
			if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
				return
			}

			// 외부 링크인 경우 처리하지 않습니다.
			let nextUrl: URL
			try {
				nextUrl = new URL(href, window.location.href)
			} catch {
				return
			}

			if (nextUrl.origin !== window.location.origin) {
				return
			}

			// 같은 페이지인 경우 처리하지 않습니다.
			const nextRoute = `${nextUrl.pathname}${nextUrl.search}`
			const currentRoute = `${window.location.pathname}${window.location.search}`

			if (nextRoute === currentRoute) {
				return
			}

			startLoading()
		}

		/**
		 * 클릭 이벤트 캡쳐
		 * - 캡쳐 단계에서 클릭 이벤트 처리 (stopPropagation 전에 처리)
		 */
		document.addEventListener('click', handleClick, true)

		return () => {
			document.removeEventListener('click', handleClick, true)
		}
	}, [])

	/**
	 * 로딩 Progress Bar 업데이트
	 * - 90% 가 될 때까지 280ms 간격으로 랜덤하게 12% 씩 증가
	 * - 90% 이상이 되면 해당 수치로 렌더링
	 */
	useEffect(() => {
		if (state !== 'loading') {
			return
		}

		intervalRef.current = window.setInterval(() => {
			setWidth((previous) => {
				if (previous >= 90) {
					return previous
				}

				return previous + Math.random() * 12
			})
		}, 280)

		return () => {
			if (intervalRef.current !== undefined) {
				window.clearInterval(intervalRef.current)
			}
		}
	}, [state])

	/**
	 * 페이지 이동 완료 처리
	 * - 완료 처리 후 100%로 렌더링
	 * - 220ms 후 대기 상태로 전환
	 */
	useEffect(() => {
		if (isFirstRouteRef.current) {
			isFirstRouteRef.current = false
			return
		}

		if (intervalRef.current !== undefined) {
			window.clearInterval(intervalRef.current)
		}

		setState('completing')
		setWidth(100)

		const timeout = window.setTimeout(() => {
			setState('idle')
			setWidth(0)
		}, 220)

		return () => {
			window.clearTimeout(timeout)
		}
	}, [routeKey])

	const visible = state !== 'idle'

	return (
		<div
			aria-hidden={!visible}
			aria-valuenow={visible ? Math.round(width) : 0}
			aria-valuemin={0}
			aria-valuemax={100}
			role="progressbar"
			className={cn(
				// z-sticky(1100) 헤더 위에 표시. h-1(4px)은 얇지만 스크린 가장자리에서 식별 가능한 최소 두께.
				'pointer-events-none fixed inset-x-0 top-0 z-1150 h-1 transition-opacity duration-200',
				visible ? 'opacity-100' : 'opacity-0'
			)}
		>
			<div
				className={cn(
					'bg-pastel-blue-600 h-full origin-left shadow-[0_0_10px_rgb(110_184_242/0.55)] transition-[width] duration-200 ease-out',
					state === 'completing' && 'duration-150'
				)}
				style={{ width: `${width}%` }}
			/>
		</div>
	)
}

export default NavigationProgress
