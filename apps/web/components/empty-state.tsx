import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { cn } from '@shared/ui/utils'
import type { ReactNode } from 'react'

type EmptyStateProps = {
	/** 빈 상태 제목 */
	title: string
	/** 제목 아래 보조 설명 */
	description?: string
	/** 아이콘 등 미디어 영역 콘텐츠 */
	icon?: ReactNode
	/** EmptyMedia 스타일 variant */
	mediaVariant?: 'default' | 'icon'
	/** EmptyContent에 넣을 추가 콘텐츠(안내 문구, 버튼 등) */
	children?: ReactNode
	className?: string
	/** EmptyHeader 너비·정렬 등 오버라이드 (기본 max-w-sm) */
	headerClassName?: string
	/** EmptyDescription 너비·줄바꿈 등 오버라이드 */
	descriptionClassName?: string
}

/**
 * 앱 공통 빈 상태 UI.
 * @shared/ui/empty 프리미티브를 감싸 섹션·카드에서 동일한 패턴으로 재사용합니다.
 */
function EmptyState({
	title,
	description,
	icon,
	mediaVariant = 'icon',
	children,
	className,
	headerClassName,
	descriptionClassName
}: EmptyStateProps) {
	return (
		<Empty className={cn('border py-10', className)}>
			<EmptyHeader className={headerClassName}>
				{icon ? <EmptyMedia variant={mediaVariant}>{icon}</EmptyMedia> : null}
				<EmptyTitle>{title}</EmptyTitle>
				{description ? <EmptyDescription className={descriptionClassName}>{description}</EmptyDescription> : null}
			</EmptyHeader>
			{children ? <EmptyContent>{children}</EmptyContent> : null}
		</Empty>
	)
}

export default EmptyState
