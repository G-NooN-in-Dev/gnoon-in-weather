'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { dispatchNavigationStart } from '@/lib/navigation/navigation-progress-events'

type AppRouter = ReturnType<typeof useRouter>

/**
 * router.push 또는 router.replace 시 상단 progress bar를 함께 시작합니다.
 */
function useAppRouter(): AppRouter {
	const router = useRouter()

	return useMemo(
		() => ({
			...router,
			push: (href: string, options?: Parameters<AppRouter['push']>[1]) => {
				dispatchNavigationStart()
				return router.push(href, options)
			},
			replace: (href: string, options?: Parameters<AppRouter['replace']>[1]) => {
				dispatchNavigationStart()
				return router.replace(href, options)
			}
		}),
		[router]
	)
}

export default useAppRouter
