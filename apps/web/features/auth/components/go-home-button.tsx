'use client'

import { Button } from '@shared/ui/button'

import useAppRouter from '@/hooks/use-app-router'

/** 탈퇴 완료 후 메인으로 이동할 때 Header 등 서버 컴포넌트 캐시를 갱신합니다. */
function GoHomeButton() {
	const router = useAppRouter()

	const handleClick = () => {
		router.push('/')
		router.refresh()
	}

	return (
		<Button type="button" onClick={handleClick}>
			메인으로 이동하기
		</Button>
	)
}

export default GoHomeButton
